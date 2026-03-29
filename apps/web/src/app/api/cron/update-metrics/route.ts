export const dynamic = "force-dynamic";

import { searchWithPerplexity } from "@/lib/perplexity";
import { readMetrics, writeMetrics } from "@/lib/blob-store";

// Perplexity API를 활용해 최신 수치를 검색하고 metrics.json을 자동 갱신
const METRIC_QUERIES = [
  {
    product: "HBM4",
    query: `Samsung SK Hynix HBM4 latest specs 2026:
    - Pin speed (Gbps)
    - Total bandwidth (TB/s)
    - Capacity per stack (GB)
    - Stack height (Hi)
    - Yield (%)
    - Mass production status
    Answer in JSON format: {"samsung": {"pinSpeed":"","bandwidth":"","capacity":"","stack":"","yield":"","status":""}, "hynix": {"pinSpeed":"","bandwidth":"","capacity":"","stack":"","yield":"","status":""}}`
  },
  {
    product: "GDDR7",
    query: `Samsung SK Hynix GDDR7 DRAM latest specs 2026:
    - Pin speed (Gbps)
    - Capacity per module (GB)
    - Die capacity (Gb)
    - Bus width (bit)
    - Mass production status
    Answer in JSON format: {"samsung": {"pinSpeed":"","capacity":"","capacityGb":"","busWidth":"","status":""}, "hynix": {"pinSpeed":"","capacity":"","capacityGb":"","busWidth":"","status":""}}`
  },
  {
    product: "DDR5",
    query: `Samsung SK Hynix DDR5 DRAM latest specs 2026:
    - Pin speed (Gbps)
    - JEDEC standard speed
    - Core technology differences
    - Mass production status
    Answer in JSON format: {"samsung": {"pinSpeed":"","jedecTarget":"","coreTech":"","status":""}, "hynix": {"pinSpeed":"","jedecTarget":"","coreTech":"","status":""}}`
  },
];

function parseJsonFromResponse(content: string): any {
  // Try to extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates: string[] = [];
  const errors: string[] = [];

  try {
    let metrics: any;
    try {
      metrics = await readMetrics();
    } catch {
      // Use static fallback
      const staticMetrics = await import("@/data/metrics.json");
      metrics = { ...staticMetrics };
    }

    // Query Perplexity for each product
    for (const mq of METRIC_QUERIES) {
      try {
        const res = await searchWithPerplexity(
          mq.query,
          "sonar",
          {
            systemPrompt:
              "You are a semiconductor industry data analyst. Return ONLY valid JSON with the latest verified specs. Use empty string for unknown values. Do not add commentary.",
            recency: "week",
          }
        );

        const content = res?.choices?.[0]?.message?.content;
        if (!content) {
          errors.push(`${mq.product}: no content returned`);
          continue;
        }

        const parsed = parseJsonFromResponse(content);
        if (!parsed) {
          errors.push(`${mq.product}: failed to parse JSON`);
          continue;
        }

        // Update metrics for each company
        for (const company of ["samsung", "hynix"] as const) {
          if (parsed[company]) {
            if (!metrics[mq.product]) metrics[mq.product] = {};
            if (!metrics[mq.product][company]) metrics[mq.product][company] = {};

            const companyData = parsed[company];
            for (const [key, value] of Object.entries(companyData)) {
              if (value && typeof value === "string" && value.trim() !== "") {
                const existing = metrics[mq.product][company][key];
                // Only update if value is different and non-empty
                if (existing !== value) {
                  metrics[mq.product][company][key] = value;
                  updates.push(`${mq.product}.${company}.${key}: ${existing || "null"} → ${value}`);
                }
              }
            }
            metrics[mq.product][company].lastUpdated = new Date().toISOString();
          }
        }
      } catch (e: any) {
        errors.push(`${mq.product}: ${e.message}`);
      }
    }

    // Write updated metrics
    if (updates.length > 0) {
      metrics.updatedAt = new Date().toISOString().split("T")[0];
      try {
        await writeMetrics(metrics);
      } catch {
        // Blob not configured
      }
    }

    return Response.json({
      ok: true,
      updatesApplied: updates.length,
      updates,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err.message, errors },
      { status: 500 }
    );
  }
}
