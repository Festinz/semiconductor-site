"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import TrendSlider from "@/components/TrendSlider";
import staticTrends from "@/data/trends.json";

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-green-500/15 text-green-400 border-green-500/20",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  advanced: "bg-red-500/15 text-red-400 border-red-500/20",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

// Map related topic slugs to links
const TOPIC_LINKS: Record<string, { href: string; label: string }> = {
  "mosfet-evolution": { href: "/fundamentals/mosfet-evolution", label: "MOSFET 변천사" },
  mosfet: { href: "/fundamentals/mosfet-evolution", label: "MOSFET 변천사" },
  "high-k-metal-gate": { href: "/fundamentals/high-k-metal-gate", label: "High-K Metal Gate" },
  "high-k": { href: "/fundamentals/high-k-metal-gate", label: "High-K Metal Gate" },
  photo: { href: "/fundamentals/process/photo", label: "포토리소그래피" },
  etch: { href: "/fundamentals/process/etch", label: "식각" },
  diffusion: { href: "/fundamentals/process/diffusion", label: "확산/이온주입" },
  "thin-film": { href: "/fundamentals/process/thin-film", label: "박막 증착" },
  cmp: { href: "/fundamentals/process/cmp", label: "CMP" },
  hbm: { href: "/samsung/tech/hbm4", label: "HBM4" },
  ddr5: { href: "/samsung/tech/ddr5", label: "DDR5" },
  gddr7: { href: "/hynix/tech/gddr7", label: "GDDR7" },
  packaging: { href: "/samsung/tech/hbm4", label: "패키징" },
  euv: { href: "/fundamentals/process/photo", label: "EUV 리소그래피" },
  gaa: { href: "/fundamentals/mosfet-evolution", label: "GAA/MBCFET" },
};

export default function TrendsPage() {
  const [trends, setTrends] = useState<any[]>(staticTrends as any[]);

  useEffect(() => {
    fetch("/api/data/trends")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setTrends(data); })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/fundamentals" className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-emerald-500">최신 트렌드 브리핑</h1>
            <p className="text-xs text-gray-500">
              Perplexity Sonar Pro + Gemini Pro 자동 수집 · 매주 월/목 갱신
            </p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured trends carousel */}
        <div className="mb-10">
          <TrendSlider title="주요 트렌드 브리핑" />
        </div>

        {trends.length > 0 ? (
          <div className="space-y-6">
            {trends.map((trend: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {trend.type === "paper" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20 font-medium">
                        논문
                      </span>
                    )}
                    {trend.type === "trend" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                        트렌드
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-gray-200">{trend.title || "트렌드"}</h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 items-center">
                    {trend.difficulty && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                          DIFFICULTY_STYLES[trend.difficulty] || ""
                        }`}
                      >
                        {DIFFICULTY_LABELS[trend.difficulty] || trend.difficulty}
                      </span>
                    )}
                    {trend.fetchedAt && (
                      <span className="text-[10px] text-gray-600">
                        {new Date(trend.fetchedAt).toLocaleDateString("ko-KR")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Papers list (for paper type) */}
                {trend.papers && trend.papers.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {trend.papers.map((paper: any, j: number) => (
                      <div key={j} className="rounded-lg bg-purple-950/10 border border-purple-500/10 p-3">
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors"
                        >
                          {paper.title}
                        </a>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {paper.authors} {paper.venue && `· ${paper.venue}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                {trend.summary && (
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">{trend.summary}</p>
                )}

                {/* 3-column cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {trend.whyImportant && (
                    <div className="rounded-lg bg-blue-950/10 border border-blue-500/10 p-3">
                      <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 font-medium">
                        왜 중요한지
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">{trend.whyImportant}</p>
                    </div>
                  )}
                  {trend.howToStudy && (
                    <div className="rounded-lg bg-green-950/10 border border-green-500/10 p-3">
                      <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1 font-medium">
                        공부 방법
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">{trend.howToStudy}</p>
                    </div>
                  )}
                  {trend.interviewTip && (
                    <div className="rounded-lg bg-amber-950/10 border border-amber-500/10 p-3">
                      <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1 font-medium">
                        ★ 면접 팁
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">{trend.interviewTip}</p>
                    </div>
                  )}
                </div>

                {/* Related topics as clickable links */}
                {trend.relatedTopics && trend.relatedTopics.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {trend.relatedTopics.map((topic: string) => {
                      const link = TOPIC_LINKS[topic.toLowerCase()];
                      if (link) {
                        return (
                          <Link
                            key={topic}
                            href={link.href}
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 hover:bg-emerald-500/20 transition-colors"
                          >
                            {link.label} →
                          </Link>
                        );
                      }
                      return (
                        <span
                          key={topic}
                          className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-500"
                        >
                          {topic}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Sources */}
                {trend.sources && trend.sources.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {trend.sources.map((src: string, j: number) => (
                      <a
                        key={j}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-600 hover:text-gray-400 underline underline-offset-2 transition-colors"
                      >
                        출처 {j + 1}
                      </a>
                    ))}
                  </div>
                )}

                {/* Topic tag */}
                {trend.topic && (
                  <p className="text-[10px] text-gray-700 mt-2">검색 토픽: {trend.topic}</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-800 bg-gray-900/30 p-12 text-center"
          >
            <span className="text-4xl block mb-4">📡</span>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">트렌드 수집 대기 중</h2>
            <p className="text-sm text-gray-500 mb-1">
              Perplexity Sonar Pro가 매주 월/목에 자동으로 최신 트렌드를 수집합니다.
            </p>
            <p className="text-xs text-gray-600">
              수집된 트렌드는 Gemini 2.5 Pro가 요약 → 학습방향 → 면접팁으로 변환합니다.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2 max-w-lg mx-auto">
              {["HBM", "GAA", "EUV", "3D DRAM", "CXL", "극저온 식각", "실리콘 포토닉스", "유리 기판", "GDDR", "뉴로모픽"].map(
                (topic) => (
                  <span
                    key={topic}
                    className="text-[10px] px-2 py-1 rounded bg-gray-800/50 text-gray-500 text-center"
                  >
                    {topic}
                  </span>
                )
              )}
            </div>
            <p className="text-[10px] text-gray-600 mt-4">매회 10개 토픽 중 랜덤 3개 선택</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
