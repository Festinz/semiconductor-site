"use client";

import { motion } from "framer-motion";

interface NewsCardProps {
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

const importanceStyles = {
  breaking: "bg-red-500/20 text-red-400 border-red-500/30",
  major: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  normal: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const categoryLabels: Record<string, string> = {
  hbm: "HBM",
  foundry: "파운드리",
  memory: "메모리",
  packaging: "패키징",
  market: "시장",
  "ai-chip": "AI 칩",
  process: "공정",
  other: "기타",
};

export default function NewsCard({
  title,
  summary,
  category,
  importance,
  date,
  sourceUrl,
  sourceName,
  region,
}: NewsCardProps) {
  const card = (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${importanceStyles[importance]}`}
        >
          {importance === "breaking" ? "속보" : importance === "major" ? "주요" : "일반"}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
          {categoryLabels[category] || category}
        </span>
        {region === "global" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-medium">
            해외
          </span>
        )}
        <span className="text-[10px] text-gray-600 ml-auto flex items-center gap-1.5">
          {sourceName && <span>{sourceName}</span>}
          {sourceName && date && <span>·</span>}
          {date && <span>{date}</span>}
        </span>
      </div>
      <h3 className="text-sm font-semibold mb-1 line-clamp-2">{title}</h3>
      <p className="text-xs text-gray-400 line-clamp-2">{summary}</p>
      {sourceUrl && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          원문 보기
        </div>
      )}
    </motion.div>
  );

  if (sourceUrl) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return card;
}
