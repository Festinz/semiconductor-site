"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import NewsCard from "./NewsCard";

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  importance: "breaking" | "major" | "normal";
  date?: string;
  sourceUrl?: string;
  company?: string;
  sourceName?: string;
  region?: string;
}

interface NewsSliderProps {
  company: "samsung" | "hynix" | "all";
  title?: string;
}

export default function NewsSlider({ company, title = "최신 뉴스" }: NewsSliderProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchNews = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/data/news?page=${pageNum}&limit=10&company=${company}`);
      const data = await res.json();
      if (data.items) {
        setItems((prev) => pageNum === 1 ? data.items : [...prev, ...data.items]);
        setHasMore(data.hasMore);
      } else if (Array.isArray(data)) {
        // Fallback: old API format
        const filtered = company === "all" ? data : data.filter((n: NewsItem) => n.company === company || n.company === "both");
        setItems(filtered);
        setHasMore(false);
      }
    } catch {
      // Fallback to static import
    } finally {
      setLoading(false);
    }
  }, [company]);

  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 300;
    if (nearEnd) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollBy(-1)}
            className="w-8 h-8 rounded-lg border border-gray-700 bg-gray-900/80 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="w-8 h-8 rounded-lg border border-gray-700 bg-gray-900/80 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={`${item.title}-${i}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 w-[280px] snap-start"
          >
            <NewsCard
              title={item.title}
              summary={item.summary}
              category={item.category}
              importance={item.importance}
              date={item.date}
              sourceUrl={item.sourceUrl}
              sourceName={item.sourceName}
              region={item.region}
            />
          </motion.div>
        ))}

        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="flex-shrink-0 w-[280px] rounded-xl border border-gray-800 bg-gray-900/50 p-4 animate-pulse">
            <div className="flex gap-2 mb-3">
              <div className="w-12 h-4 bg-gray-800 rounded-full" />
              <div className="w-16 h-4 bg-gray-800 rounded-full" />
            </div>
            <div className="w-full h-4 bg-gray-800 rounded mb-2" />
            <div className="w-3/4 h-4 bg-gray-800 rounded mb-2" />
            <div className="w-full h-3 bg-gray-800/50 rounded" />
            <div className="w-2/3 h-3 bg-gray-800/50 rounded mt-1" />
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="flex-shrink-0 w-full rounded-xl border border-gray-800 bg-gray-900/30 p-8 text-center">
            <p className="text-sm text-gray-500">뉴스가 자동으로 수집되면 여기에 표시됩니다.</p>
            <p className="text-xs text-gray-600 mt-1">Perplexity Sonar + Gemini Flash 파이프라인</p>
          </div>
        )}
      </div>
    </div>
  );
}
