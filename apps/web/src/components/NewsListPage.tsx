"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NewsCard from "./NewsCard";

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  importance: "breaking" | "major" | "normal";
  date?: string;
  sourceUrl?: string;
  company?: string;
}

interface NewsListPageProps {
  company: "samsung" | "hynix";
  allNews: NewsItem[];
}

const CATEGORY_FILTERS = [
  { key: "all", label: "전체" },
  { key: "hbm", label: "HBM" },
  { key: "foundry", label: "파운드리" },
  { key: "memory", label: "메모리" },
  { key: "packaging", label: "패키징" },
  { key: "market", label: "시장" },
];

const PAGE_SIZE = 8;

export default function NewsListPage({ company, allNews }: NewsListPageProps) {
  const isSamsung = company === "samsung";
  const brandColor = isSamsung ? "#1428A0" : "#E4002B";
  const title = isSamsung ? "삼성전자" : "SK하이닉스";
  const basePath = isSamsung ? "/samsung" : "/hynix";

  // Filter news for this company
  const companyNews = allNews.filter(
    (n) => n.company === company || n.company === "both" || n.company === "industry"
  );

  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filtered = category === "all"
    ? companyNews
    : companyNews.filter((n) => n.category === category);

  // Sort: breaking first, then by date
  const sorted = [...filtered].sort((a, b) => {
    const importanceOrder = { breaking: 0, major: 1, normal: 2 };
    const aDiff = importanceOrder[a.importance] ?? 2;
    const bDiff = importanceOrder[b.importance] ?? 2;
    if (aDiff !== bDiff) return aDiff - bDiff;
    return (b.date || "").localeCompare(a.date || "");
  });

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  // Infinite scroll with IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Reset count on category change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={basePath} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold" style={{ color: brandColor }}>
              {title} 뉴스
            </h1>
            <p className="text-xs text-gray-500">
              Perplexity Sonar + Gemini Flash 자동 수집 · 매일 2회 갱신
            </p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {CATEGORY_FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? companyNews.length
                : companyNews.filter((n) => n.category === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setCategory(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  category === f.key
                    ? "text-white"
                    : "text-gray-500 bg-gray-900/30 hover:text-gray-300"
                }`}
                style={
                  category === f.key
                    ? { backgroundColor: `${brandColor}20`, border: `1px solid ${brandColor}40`, color: brandColor }
                    : undefined
                }
              >
                {f.label}
                <span className="text-gray-600 ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 text-[10px] text-gray-600">
          <span>{sorted.length}건</span>
          <span>
            속보 {sorted.filter((n) => n.importance === "breaking").length} ·
            주요 {sorted.filter((n) => n.importance === "major").length} ·
            일반 {sorted.filter((n) => n.importance === "normal").length}
          </span>
        </div>

        {/* News list */}
        {visible.length > 0 ? (
          <div className="space-y-4">
            {visible.map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <NewsCard
                  title={item.title}
                  summary={item.summary}
                  category={item.category}
                  importance={item.importance}
                  date={item.date}
                  sourceUrl={item.sourceUrl}
                />
              </motion.div>
            ))}

            {/* Infinite scroll loader */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-6">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: brandColor }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!hasMore && sorted.length > PAGE_SIZE && (
              <p className="text-center text-[10px] text-gray-600 py-4">
                모든 뉴스를 불러왔습니다 ({sorted.length}건)
              </p>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-800 bg-gray-900/30 p-12 text-center"
          >
            <span className="text-4xl block mb-4">📰</span>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">뉴스 수집 대기 중</h2>
            <p className="text-sm text-gray-500 mb-1">
              Perplexity Sonar가 매일 09:00, 18:00 KST에 자동으로 뉴스를 수집합니다.
            </p>
            <p className="text-xs text-gray-600">
              수집된 뉴스는 Gemini 2.5 Flash가 3줄 요약 + 카테고리 분류 + 수치 추출을 수행합니다.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
