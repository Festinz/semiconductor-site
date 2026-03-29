"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TechCard from "@/components/TechCard";
import NewsSlider from "@/components/NewsSlider";
import samsungData from "@/data/samsung-tech.json";
import metricsData from "@/data/metrics.json";

const BRAND_COLOR = "#1428A0";
const COMPETITOR = "하이닉스";

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

  // Capacity
  const capVal = specs.capacity?.value || (metricsCompany?.capacity ? `${metricsCompany.capacity} GB` : null);
  const compCap = metricsCompetitor?.capacity ? `${metricsCompetitor.capacity}` : null;
  const capHighlight = lineupKey === "GDDR7" && metricsCompetitor?.capacityNote;
  rows.push({
    label: "용량",
    value: capVal,
    competitorValue: compCap ? (metricsCompetitor?.capacityNote ? `${compCap} (${metricsCompetitor.capacityNote})` : compCap) : null,
    unit: "GB",
    highlight: false,
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

export default function SamsungPage() {
  const lineups = samsungData.lineups;
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
                삼성전자 반도체
              </h1>
              <p className="text-xs text-gray-500">{samsungData.slogan}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
            <span>{samsungData.division} · {samsungData.leader}</span>
            <span className="text-gray-700">|</span>
            <span>시총 {samsungData.marketCap}</span>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Foundry & Packaging highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-400">파운드리 2nm GAA</span>
            </div>
            <p className="text-xs text-gray-400">
              MBCFET™ 수율 {samsungData.foundry.yield} · {samsungData.foundry.yieldProgress}
            </p>
            <p className="text-[10px] text-gray-600 mt-1">{samsungData.foundry.competitorYield}</p>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-400">패키징 {samsungData.packaging.name}</span>
            </div>
            <p className="text-xs text-gray-400">{samsungData.packaging.advantage}</p>
            <p className="text-[10px] text-gray-600 mt-1">
              HCB: {samsungData.packaging.hcb.benefit}, {samsungData.packaging.hcb.stackSupport} 지원
            </p>
          </div>
        </motion.div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold"
          >
            기술 라인업
          </motion.h2>
          <Link
            href="/samsung/compare"
            className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-colors"
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
            const metricsCompany = metrics?.samsung;
            const metricsCompetitor = metrics?.hynix;
            const jedecData = metrics?.jedec;

            return (
              <TechCard
                key={key}
                name={lineup.name}
                fullName={lineup.fullName}
                slug={key.toLowerCase()}
                company="samsung"
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
          <NewsSlider company="samsung" title="삼성 최신 뉴스" />
        </motion.div>
      </div>
    </main>
  );
}
