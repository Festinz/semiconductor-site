"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import JEDECProgressBar from "./JEDECProgressBar";

interface SpecRow {
  label: string;
  value: string | null;
  competitorValue: string | null;
  unit: string;
  highlight?: boolean;
}

interface TechCardProps {
  name: string;
  fullName: string;
  slug: string;
  company: "samsung" | "hynix";
  status: string;
  milestone?: string | null;
  differentiator?: string | null;
  specs: SpecRow[];
  jedec?: { achieved: number; target: number; unit: string } | null;
  brandColor: string;
  competitorName: string;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const statusColors: Record<string, string> = {
  "양산 출하 중": "bg-emerald-500/20 text-emerald-400",
  "양산 중": "bg-emerald-500/20 text-emerald-400",
  "최종 샘플 단계": "bg-amber-500/20 text-amber-400",
  "개발 중": "bg-blue-500/20 text-blue-400",
  "차세대 개발 중": "bg-purple-500/20 text-purple-400",
};

export default function TechCard({
  name,
  fullName,
  slug,
  company,
  status,
  milestone,
  differentiator,
  specs,
  jedec,
  brandColor,
  competitorName,
  index,
}: TechCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link href={`/${company}/tech/${slug}`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-6 hover:border-gray-700 transition-all cursor-pointer h-full flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{fullName}</p>
            </div>
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                statusColors[status] || "bg-gray-500/20 text-gray-400"
              }`}
            >
              {status}
            </span>
          </div>

          {/* Milestone badge */}
          {milestone && (
            <div
              className="text-[11px] px-3 py-1.5 rounded-lg mb-4 font-medium"
              style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
            >
              {milestone}
            </div>
          )}

          {/* Specs table */}
          <div className="space-y-3 flex-1">
            {specs.map((spec) => (
              <div key={spec.label}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <div className="text-right">
                    {spec.value ? (
                      <span
                        className={`text-sm font-semibold ${spec.highlight ? "" : "text-gray-100"}`}
                        style={spec.highlight ? { color: brandColor } : undefined}
                      >
                        {spec.value}
                        <span className="text-[10px] text-gray-500 ml-1">{spec.unit}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">-</span>
                    )}
                  </div>
                </div>
                {/* Competitor value in gray small text */}
                {spec.competitorValue && (
                  <div className="text-right mt-0.5">
                    <span className="text-[10px] text-gray-600">
                      {competitorName} {spec.competitorValue} {spec.unit}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Differentiator */}
          {differentiator && (
            <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-800/60 line-clamp-2">
              {differentiator}
            </p>
          )}

          {/* JEDEC Progress Bar */}
          {jedec && (
            <div className="mt-4 pt-3 border-t border-gray-800/60">
              <JEDECProgressBar
                achieved={jedec.achieved}
                target={jedec.target}
                unit={jedec.unit}
                color={brandColor}
              />
            </div>
          )}

          {/* Arrow indicator */}
          <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
            상세 보기
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
