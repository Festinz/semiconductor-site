export const dynamic = "force-dynamic";

// Vercel Cron: 매주 월/목 09:00 KST
import { fetchTrends, fetchLatestPapers } from "@/lib/perplexity";
import { generateTrendBrief, generatePaperBrief } from "@/lib/gemini";
import { readTrends, writeTrends } from "@/lib/blob-store";

const TREND_TOPICS = [
  "HBM4 HBM5 packaging",
  "GAA MBCFET gate all around yield",
  "EUV High-NA lithography",
  "3D DRAM CMOS under array",
  "cryogenic etching semiconductor",
  "silicon photonics chip interconnect",
  "glass substrate advanced packaging",
  "GDDR7 GDDR8 GPU memory",
  "CXL memory pooling",
  "neuromorphic computing semiconductor",
  "backside power delivery network BSPDN",
  "chiplet heterogeneous integration",
  "CFET complementary FET",
  "molybdenum interconnect",
  "high bandwidth memory thermal management",
];

const PAPER_TOPICS = [
  "HBM TSV thermal reliability",
  "gate-all-around nanosheet transistor",
  "EUV stochastic defect",
  "3D NAND string stacking",
  "advanced DRAM capacitor high-k",
  "atomic layer deposition ALD",
  "hybrid bonding wafer-to-wafer",
  "ferroelectric FET FeRAM memory",
  "2D material transistor MoS2",
  "in-memory computing DRAM PIM",
];

export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const errors: string[] = [];

  try {
    // 랜덤 3개 트렌드 토픽 + 2개 논문 토픽 선택
    const shuffledTrends = [...TREND_TOPICS].sort(() => Math.random() - 0.5);
    const shuffledPapers = [...PAPER_TOPICS].sort(() => Math.random() - 0.5);
    const trendTopics = shuffledTrends.slice(0, 3);
    const paperTopics = shuffledPapers.slice(0, 2);

    const briefs = [];

    // 트렌드 리서치
    for (const topic of trendTopics) {
      try {
        const trendData = await fetchTrends(topic);
        const brief = await generateTrendBrief(JSON.stringify(trendData));
        briefs.push({
          ...brief,
          fetchedAt: new Date().toISOString(),
          topic,
          type: "trend",
        });
      } catch (err: any) {
        errors.push(`Trend "${topic}": ${err.message}`);
      }
    }

    // 최신 논문 리서치
    for (const topic of paperTopics) {
      try {
        const paperData = await fetchLatestPapers(topic);
        const brief = await generatePaperBrief(JSON.stringify(paperData));
        briefs.push({
          ...brief,
          fetchedAt: new Date().toISOString(),
          topic,
          type: "paper",
        });
      } catch (err: any) {
        errors.push(`Paper "${topic}": ${err.message}`);
      }
    }

    if (briefs.length === 0) {
      return Response.json({
        ok: false,
        message: "All trend fetches failed",
        errors,
      });
    }

    // trends.json에 append (Vercel Blob, 기존 유지, 최신이 위로, 최대 50건)
    let blobError = "";
    let totalTrends = briefs.length;
    try {
      const existing = await readTrends();
      const existingTitles = new Set(existing.map((e: any) => e.title));
      const newBriefs = briefs.filter((b) => !existingTitles.has(b.title));
      const updated = [...newBriefs, ...existing].slice(0, 50);
      await writeTrends(updated);
      totalTrends = updated.length;
    } catch (e: any) {
      blobError = e.message;
    }

    return Response.json({
      ok: true,
      newTrends: briefs.length,
      totalTrends,
      topics: [...trendTopics, ...paperTopics],
      errors: errors.length > 0 ? errors : undefined,
      blobError: blobError || undefined,
      data: briefs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err.message, errors },
      { status: 500 }
    );
  }
}
