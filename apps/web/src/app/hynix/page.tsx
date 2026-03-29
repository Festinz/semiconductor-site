"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TechCard from "@/components/TechCard";
import NewsSlider from "@/components/NewsSlider";
import hynixData from "@/data/hynix-tech.json";
import metricsData from "@/data/metrics.json";

const BRAND_COLOR = "#E4002B";
const COMPETITOR = "삼성";

function buildSpecRows(
  lineupKey: string,
  lineup: any,
  metricsCompany: any,
  metricsCompetitor: any
) {
  const specs = lineup.specs;
  const rows = [];

  // Pin Speed
  const pinVal = specs.pinSpeed?.value || (metricsCompany?.pinSpeed ? `${metricsCompany.pinSpeed} Gbps` : null);
  const compPin = metricsCompetitor?.pinSpeed ? `${metricsCompetitor.pinSpeed}` : null;
  rows.push({
    label: "핀속도",
    value: pinVal,
    competitorValue: compPin,
    unit: "Gbps",
    highlight: false,
  });

  // Bandwidth
  const bwVal = specs.bandwidth?.value || (metricsCompany?.bandwidth ? `${metricsCompany.bandwidth} TB/s` : null);
  const compBw = metricsCompetitor?.bandwidth ? `${metricsCompetitor.bandwidth}` : null;
  rows.push({
    label: "대역폭",
    value: bwVal,
    competitorValue: compBw,
    unit: "TB/s",
    highlight: false,
  });

  // Capacity — highlight GDDR7 48GB for hynix
  const capVal = specs.capacity?.value || (metricsCompany?.capacity ? `${metricsCompany.capacity} GB` : null);
  const compCap = metricsCompetitor?.capacity ? `${metricsCompetitor.capacity}` : null;
  const isGDDR7Highlight = lineupKey === "GDDR7";
  rows.push({
    label: "용량",
    value: isGDDR7Highlight && specs.capacity?.note
      ? `${capVal} (${specs.capacity.note})`
      : capVal,
    competitorValue: compCap,
    unit: "GB",
    highlight: isGDDR7Highlight,
  });

  // Power Efficiency
  const peVal = specs.powerEfficiency?.value || (metricsCompany?.powerEfficiency ? `${metricsCompany.powerEfficiency}%↓` : null);
  const compPe = metricsCompetitor?.powerEfficiency ? `${metricsCompetitor.powerEfficiency}%↓` : null;
  rows.push({
    label: "전력효율",
    value: peVal,
    competitorValue: compPe,
    unit: "",
    highlight: false,
  });

  return rows;
}

function getJedec(lineupKey: string, metricsCompany: any, jedecData: any) {
  if (!metricsCompany?.actualAchieved || !jedecData?.pinSpeed) return null;
  return {
    achieved: parseFloat(metricsCompany.actualAchieved),
    target: parseFloat(jedecData.pinSpeed),
    unit: "Gbps",
  };
}

const lineupOrder = ["HBM4", "DDR5", "GDDR7", "LPDDR6", "NAND"] as const;

export default function HynixPage() {
  const lineups = hynixData.lineups;
  return (
    <main className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold" style={{ color: BRAND_COLOR }}>
                SK하이닉스 반도체
              </h1>
              <p className="text-xs text-gray-500">{hynixData.slogan}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
            <span>2024 영업이익 {hynixData.operatingProfit2024}</span>
            <span className="text-gray-700">|</span>
            <span>2025 Q1 {hynixData.milestone2025Q1}</span>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Core story banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 mb-6"
        >
          <p className="text-sm text-red-300/80 italic">
            &ldquo;{hynixData.coreStory}&rdquo;
          </p>
        </motion.div>

        {/* Future tech highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {hynixData.futureTech.map((tech) => (
            <div key={tech.name} className="rounded-xl border border-red-500/15 bg-gray-900/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-semibold text-red-400">{tech.name}</span>
              </div>
              <p className="text-xs text-gray-400">{tech.description}</p>
              <p className="text-[10px] text-gray-600 mt-1">{tech.benefit}</p>
            </div>
          ))}
        </motion.div>

        {/* HBM History timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 mb-10"
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: BRAND_COLOR }}>
            HBM 세대 히스토리 — 세계 최초 개발 (2013)
          </h3>
          <div className="flex flex-wrap gap-2">
            {(lineups.HBM4.hbmHistory || "").split(" → ").map((gen: string, i: number, arr: string[]) => (
              <div key={gen} className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    i === arr.length - 1
                      ? "border-red-500/40 bg-red-500/10 text-red-400 font-semibold"
                      : "border-gray-700 bg-gray-800/50 text-gray-400"
                  }`}
                >
                  {gen}
                </span>
                {i < arr.length - 1 && (
                  <svg className="w-3 h-3 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-500">
            <span>시장 점유율: <strong className="text-red-400">~70%</strong> (UBS)</span>
            <span>12단 36GB 가격: ~$500</span>
          </div>
        </motion.div>

        {/* Section title + compare link */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-lg font-semibold"
          >
            기술 라인업
          </motion.h2>
          <Link
            href="/hynix/compare"
            className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            양사 비교 →
          </Link>
        </div>

        {/* Tech cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {lineupOrder.map((key, index) => {
            const lineup = lineups[key] as any;
            if (!lineup) return null;
            const metrics = (metricsData as any)[key];
            const metricsCompany = metrics?.hynix;
            const metricsCompetitor = metrics?.samsung;
            const jedecData = metrics?.jedec;

            return (
              <TechCard
                key={key}
                name={lineup.name}
                fullName={lineup.fullName}
                slug={key.toLowerCase()}
                company="hynix"
                status={lineup.status}
                milestone={lineup.milestone || null}
                differentiator={lineup.differentiator || null}
                specs={buildSpecRows(key, lineup, metricsCompany, metricsCompetitor)}
                jedec={getJedec(key, metricsCompany, jedecData)}
                brandColor={BRAND_COLOR}
                competitorName={COMPETITOR}
                index={index}
              />
            );
          })}
        </div>

        {/* News section — horizontal slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <NewsSlider company="hynix" title="하이닉스 최신 뉴스" />
        </motion.div>
      </div>
    </main>
  );
}
