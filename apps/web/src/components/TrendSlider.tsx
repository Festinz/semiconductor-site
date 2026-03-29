"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrendItem {
  title: string;
  summary: string;
  whyImportant?: string;
  howToStudy?: string;
  interviewTip?: string;
  relatedTopics?: string[];
  difficulty?: string;
  date?: string;
  sources?: { title: string; url: string }[];
}

interface TrendSliderProps {
  title?: string;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/15 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/15 text-red-400 border-red-500/20",
};

const difficultyLabels: Record<string, string> = {
  beginner: "기초",
  intermediate: "중급",
  advanced: "심화",
};

export default function TrendSlider({ title = "최신 트렌드" }: TrendSliderProps) {
  const [items, setItems] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/data/trends")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
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
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <motion.div
            key={`${item.title}-${i}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 w-[300px] snap-start"
          >
            <div
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-colors cursor-pointer h-full flex flex-col"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {item.difficulty && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColors[item.difficulty] || difficultyColors.intermediate}`}>
                    {difficultyLabels[item.difficulty] || item.difficulty}
                  </span>
                )}
                {item.date && (
                  <span className="text-[10px] text-gray-600 ml-auto">{item.date}</span>
                )}
              </div>

              {/* Title + Summary */}
              <h3 className="text-sm font-semibold mb-1.5 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 flex-1">{item.summary}</p>

              {/* Related topics */}
              {item.relatedTopics && item.relatedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.relatedTopics.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Expanded content */}
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                      {item.whyImportant && (
                        <div>
                          <p className="text-[10px] font-semibold text-cyan-400 mb-0.5">왜 중요한가</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">{item.whyImportant}</p>
                        </div>
                      )}
                      {item.howToStudy && (
                        <div>
                          <p className="text-[10px] font-semibold text-green-400 mb-0.5">공부 방법</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">{item.howToStudy}</p>
                        </div>
                      )}
                      {item.interviewTip && (
                        <div>
                          <p className="text-[10px] font-semibold text-yellow-400 mb-0.5">면접 팁</p>
                          <p className="text-[11px] text-gray-300 leading-relaxed">{item.interviewTip}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="flex-shrink-0 w-[300px] rounded-xl border border-gray-800 bg-gray-900/50 p-4 animate-pulse">
            <div className="w-16 h-4 bg-gray-800 rounded-full mb-3" />
            <div className="w-full h-4 bg-gray-800 rounded mb-2" />
            <div className="w-3/4 h-4 bg-gray-800 rounded mb-3" />
            <div className="w-full h-3 bg-gray-800/50 rounded" />
            <div className="w-2/3 h-3 bg-gray-800/50 rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
