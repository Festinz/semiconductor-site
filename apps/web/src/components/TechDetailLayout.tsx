"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import JEDECProgressBar from "./JEDECProgressBar";
import NewsCard from "./NewsCard";

/* ---------- types ---------- */

interface SpecItem {
  label: string;
  value: string | null;
  competitorValue?: string | null;
  unit: string;
}

interface AccordionItem {
  title: string;
  content: string;
}

interface NewsItem {
  title: string;
  summary: string;
  category: string;
  importance: "breaking" | "major" | "normal";
  date?: string;
  sourceUrl?: string;
}

interface TechDetailLayoutProps {
  /* identity */
  company: "samsung" | "hynix";
  brandColor: string;
  competitorName: string;
  backHref: string;

  /* hero */
  name: string;
  fullName: string;
  oneLiner: string;
  status: string;
  milestone?: string | null;

  /* analogy */
  analogy: {
    emoji: string;
    title: string;
    description: string;
  };

  /* specs */
  specs: SpecItem[];
  jedec?: { achieved: number; target: number; unit: string } | null;

  /* accordion deep dive */
  deepDive: AccordionItem[];

  /* interactive element */
  interactive: ReactNode;

  /* news */
  relatedNews: NewsItem[];

  /* sources */
  sources?: string[];
}

/* ---------- sub-components ---------- */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "양산 출하 중": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "양산 중": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "최종 샘플 단계": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "개발 중": "bg-sky-500/20 text-sky-400 border-sky-500/30",
    "차세대 개발 중": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  const cls = map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${cls}`}>
      {status}
    </span>
  );
}

function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/30 transition-colors"
            >
              <span className="text-sm font-medium text-gray-200">{item.title}</span>
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 text-gray-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- main component ---------- */

export default function TechDetailLayout({
  company,
  brandColor,
  competitorName,
  backHref,
  name,
  fullName,
  oneLiner,
  status,
  milestone,
  analogy,
  specs,
  jedec,
  deepDive,
  interactive,
  relatedNews,
  sources,
}: TechDetailLayoutProps) {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={backHref} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate" style={{ color: brandColor }}>
              {name}
            </h1>
            <p className="text-xs text-gray-500 truncate">{fullName}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* 1) Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="text-lg text-gray-200 mb-3">{oneLiner}</p>
          {milestone && (
            <div
              className="inline-block text-sm px-4 py-2 rounded-xl font-medium"
              style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
            >
              {milestone}
            </div>
          )}
        </motion.section>

        {/* 2) Analogy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{analogy.emoji}</span>
            <div>
              <h2 className="text-base font-semibold text-gray-200 mb-1">
                쉽게 말하면... {analogy.title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">{analogy.description}</p>
            </div>
          </div>
        </motion.section>

        {/* 3) Specs card with competitor comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-base font-semibold mb-4">통합 지표</h2>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
            <div className="space-y-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</span>
                    <div className="text-right">
                      {s.value ? (
                        <span className="text-sm font-semibold text-gray-100">
                          {s.value}
                          {s.unit && <span className="text-[10px] text-gray-500 ml-1">{s.unit}</span>}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </div>
                  </div>
                  {s.competitorValue && (
                    <p className="text-right text-[10px] text-gray-600 mt-0.5">
                      {competitorName} {s.competitorValue} {s.unit}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {jedec && (
              <div className="mt-5 pt-4 border-t border-gray-800/60">
                <JEDECProgressBar
                  achieved={jedec.achieved}
                  target={jedec.target}
                  unit={jedec.unit}
                  color={brandColor}
                />
              </div>
            )}
          </div>
        </motion.section>

        {/* 4) Deep dive accordion */}
        {deepDive.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-base font-semibold mb-4">기술 깊이 탐구</h2>
            <Accordion items={deepDive} />
          </motion.section>
        )}

        {/* 5) Interactive element */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-base font-semibold mb-4">인터랙티브</h2>
          {interactive}
        </motion.section>

        {/* 6) Related news */}
        {relatedNews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-base font-semibold mb-4">관련 뉴스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedNews.map((n, i) => (
                <NewsCard key={i} {...n} />
              ))}
            </div>
          </motion.section>
        )}

        {/* 7) Sources */}
        {sources && sources.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-[11px] text-gray-600"
          >
            <h3 className="text-xs font-medium text-gray-500 mb-2">출처</h3>
            <ul className="space-y-1">
              {sources.map((src, i) => (
                <li key={i}>
                  {src.startsWith("http") ? (
                    <a href={src} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 underline underline-offset-2">
                      {src}
                    </a>
                  ) : (
                    src
                  )}
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>
    </main>
  );
}
