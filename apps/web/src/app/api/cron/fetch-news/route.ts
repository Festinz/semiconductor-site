export const dynamic = "force-dynamic";

// Vercel Cron: 매일 09:00, 18:00 KST
import { fetchSemiNews, fetchGlobalNews, type PerplexityResponse } from "@/lib/perplexity";
import { summarizeNews } from "@/lib/gemini";
import { readNews, writeNews, readMetrics, writeMetrics } from "@/lib/blob-store";

function extractArticles(
  response: PerplexityResponse,
  source: string
): { text: string; citations: string[]; source: string }[] {
  const content = response?.choices?.[0]?.message?.content;
  const citations = response?.citations || [];
  if (!content) return [];

  // Split by numbered list items (1. 2. 3. etc) or double newlines
  const blocks = content
    .split(/(?=\d+[\.\)]\s)/)
    .map((b) => b.trim())
    .filter((b) => b.length > 30);

  if (blocks.length > 0) {
    return blocks.map((text) => ({ text, citations, source }));
  }

  // Fallback: split by paragraphs
  return content
    .split("\n\n")
    .filter((p) => p.trim().length > 30)
    .map((text) => ({ text: text.trim(), citations, source }));
}

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
  let totalNews = 0;
  let totalMetrics = 0;

  try {
    // 1. Perplexity로 뉴스 검색 — 한국(삼성/하이닉스) + 글로벌
    const [samsungRes, hynixRes, globalRes] = await Promise.all([
      fetchSemiNews("samsung").catch((e) => {
        errors.push(`Samsung KR news: ${e.message}`);
        return null;
      }),
      fetchSemiNews("hynix").catch((e) => {
        errors.push(`Hynix KR news: ${e.message}`);
        return null;
      }),
      fetchGlobalNews().catch((e) => {
        errors.push(`Global news: ${e.message}`);
        return null;
      }),
    ]);

    const allArticles = [
      ...(samsungRes ? extractArticles(samsungRes, "kr-samsung") : []),
      ...(hynixRes ? extractArticles(hynixRes, "kr-hynix") : []),
      ...(globalRes ? extractArticles(globalRes, "global") : []),
    ];

    if (allArticles.length === 0) {
      return Response.json({
        ok: false,
        message: "No articles extracted",
        errors,
      });
    }

    // 2. Gemini로 요약 + 수치 추출 (최대 15개 병렬, 에러 무시)
    const summaryResults = await Promise.allSettled(
      allArticles.slice(0, 15).map((a) => summarizeNews(a.text, a.citations, a.source))
    );

    const summaries = summaryResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((s) => s && s.title && s.summary);

    const failedCount = summaryResults.filter((r) => r.status === "rejected").length;
    if (failedCount > 0) {
      errors.push(`${failedCount} articles failed summarization`);
    }

    // 3. news.json 갱신 (Vercel Blob — gracefully skip if no token)
    let blobError = "";
    try {
      const existing = await readNews();
      const existingTitles = new Set(existing.map((e: any) => e.title));
      const newItems = summaries.filter((s) => !existingTitles.has(s.title));
      const updated = [...newItems, ...existing].slice(0, 100);
      await writeNews(updated);
      totalNews = newItems.length;
    } catch (e: any) {
      blobError = e.message;
      totalNews = summaries.length;
    }

    // 4. metrics.json 갱신 (Vercel Blob)
    const metricsUpdates = summaries.flatMap((s: any) => s.metricsUpdates || []);
    if (metricsUpdates.length > 0) {
      try {
        const metrics = await readMetrics();

        metricsUpdates.forEach((u: any) => {
          if (!u.product || !u.company || !u.field || !u.value) return;
          if (!metrics[u.product]) metrics[u.product] = {};
          if (!metrics[u.product][u.company]) metrics[u.product][u.company] = {};
          metrics[u.product][u.company][u.field] = u.value;
          metrics[u.product][u.company].lastUpdated = new Date().toISOString();
        });

        await writeMetrics(metrics);
        totalMetrics = metricsUpdates.length;
      } catch {
        // Blob storage not configured
      }
    }

    return Response.json({
      ok: true,
      newsAdded: totalNews,
      totalProcessed: summaries.length,
      metricsUpdated: totalMetrics,
      errors: errors.length > 0 ? errors : undefined,
      blobError: blobError || undefined,
      data: summaries,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err.message, errors },
      { status: 500 }
    );
  }
}
