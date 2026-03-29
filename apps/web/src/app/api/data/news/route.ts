export const dynamic = "force-dynamic";

import { readNews } from "@/lib/blob-store";
import staticNews from "@/data/news.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const company = searchParams.get("company") || "all";

  let allNews: any[] = [];

  try {
    const blobNews = await readNews();
    if (blobNews.length > 0) {
      allNews = blobNews;
    }
  } catch {}

  if (allNews.length === 0) {
    allNews = staticNews as any[];
  }

  // Filter by company
  const filtered =
    company === "all"
      ? allNews
      : allNews.filter(
          (n: any) => n.company === company || n.company === "both"
        );

  // Paginate
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  const hasMore = start + limit < filtered.length;

  return Response.json({
    items,
    hasMore,
    total: filtered.length,
    page,
  });
}
