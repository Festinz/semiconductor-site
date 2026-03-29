"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CompanyComparisonCard from "./CompanyComparisonCard";
import metricsData from "@/data/metrics.json";
import samsungData from "@/data/samsung-tech.json";
import hynixData from "@/data/hynix-tech.json";

const TABS = [
  { key: "HBM4", label: "HBM4" },
  { key: "DDR5", label: "DDR5" },
  { key: "GDDR7", label: "GDDR7" },
  { key: "LPDDR6", label: "LPDDR6" },
  { key: "NAND", label: "NAND" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const fullNames: Record<TabKey, string> = {
  HBM4: "High Bandwidth Memory 4",
  DDR5: "Double Data Rate 5",
  GDDR7: "Graphics DDR7",
  LPDDR6: "Low Power DDR6",
  NAND: "NAND Flash Memory",
};

// All available categories with metadata
const ALL_CATEGORIES: Record<string, { label: string; unit: string }> = {
  pinSpeed: { label: "핀속도", unit: "Gbps" },
  bandwidth: { label: "대역폭", unit: "TB/s" },
  capacity: { label: "용량", unit: "GB" },
  capacityGb: { label: "용량 (die)", unit: "Gb" },
  powerEfficiency: { label: "전력효율", unit: "% 절감" },
  latency: { label: "지연시간", unit: "ns" },
  busWidth: { label: "메모리 버스 폭", unit: "bit" },
  interposer: { label: "인터포저 연결 구조", unit: "" },
  capacityPerStack: { label: "스택당 용량", unit: "GB" },
  jedecTarget: { label: "JEDEC 목표", unit: "Gbps" },
  actualAchieved: { label: "실제 달성", unit: "Gbps" },
  processNode: { label: "공정 노드", unit: "nm" },
};

// Fallback order if categoryByProduct not defined
const DEFAULT_CATEGORIES = ["pinSpeed", "bandwidth", "capacity", "powerEfficiency", "actualAchieved"];

function parseNum(val: any): number | null {
  if (val == null || val === "") return null;
  const str = String(val).replace(/[^0-9.\-]/g, "");
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

function buildMetrics(tabKey: TabKey) {
  const data = (metricsData as any)[tabKey];
  if (!data) return [];
  const samsung = data.samsung || {};
  const hynix = data.hynix || {};
  const jedec = data.jedec || {};

  // Use product-specific category ordering from metrics.json
  const categoryByProduct = (metricsData as any).categoryByProduct || {};
  const categoryKeys: string[] = categoryByProduct[tabKey] || DEFAULT_CATEGORIES;

  return categoryKeys
    .filter((key) => ALL_CATEGORIES[key])
    .map((key) => {
      const cat = ALL_CATEGORIES[key];
      return {
        label: cat.label,
        unit: cat.unit,
        samsung: parseNum(samsung[key]),
        hynix: parseNum(hynix[key]),
        jedec: parseNum(jedec[key]),
        samsungExtra:
          key === "pinSpeed" && samsung.pinSpeedMax
            ? `(max ${samsung.pinSpeedMax})`
            : key === "capacity" && samsung.capacityNote
              ? samsung.capacityNote
              : key === "capacityGb" && samsung.capacityGbNote
                ? samsung.capacityGbNote
                : undefined,
        hynixExtra:
          key === "pinSpeed" && hynix.pinSpeedMax
            ? `(max ${hynix.pinSpeedMax})`
            : key === "capacity" && hynix.capacityNote
              ? hynix.capacityNote
              : key === "capacityGb" && hynix.capacityGbNote
                ? hynix.capacityGbNote
                : undefined,
      };
    });
}

function getLineupInfo(tabKey: TabKey) {
  const s = (samsungData.lineups as any)[tabKey];
  const h = (hynixData.lineups as any)[tabKey];
  const m = (metricsData as any)[tabKey];

  return {
    samsungStatus: s?.status || "-",
    hynixStatus: h?.status || "-",
    samsungDiff: m?.samsung?.differentiator || s?.differentiator || "-",
    hynixDiff: m?.hynix?.differentiator || h?.differentiator || "-",
    samsungUpdated: m?.samsung?.lastUpdated || "",
    hynixUpdated: m?.hynix?.lastUpdated || "",
  };
}

interface CompareDashboardProps {
  company: "samsung" | "hynix";
}

export default function CompareDashboard({ company }: CompareDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("HBM4");

  const isSamsung = company === "samsung";
  const brandColor = isSamsung ? "#1428A0" : "#E4002B";
  const title = isSamsung ? "삼성전자" : "SK하이닉스";
  const basePath = isSamsung ? "/samsung" : "/hynix";

  const metrics = buildMetrics(activeTab);
  const info = getLineupInfo(activeTab);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href={basePath}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold">
              <span style={{ color: brandColor }}>{title}</span>
              <span className="text-gray-400 font-normal"> vs </span>
              <span className="text-gray-300">
                {isSamsung ? "SK하이닉스" : "삼성전자"}
              </span>
            </h1>
            <p className="text-xs text-gray-500">통합 지표 비교 대시보드</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300 bg-gray-900/40 hover:bg-gray-800/60"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: `${brandColor}20`, border: `1px solid ${brandColor}40` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <CompanyComparisonCard
              lineup={activeTab}
              fullName={fullNames[activeTab]}
              metrics={metrics}
              samsungStatus={info.samsungStatus}
              hynixStatus={info.hynixStatus}
              samsungDiff={info.samsungDiff}
              hynixDiff={info.hynixDiff}
              samsungUpdated={info.samsungUpdated}
              hynixUpdated={info.hynixUpdated}
              highlightCompany={company}
            />
          </motion.div>
        </AnimatePresence>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Samsung summary */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: `${isSamsung ? brandColor : "#1428A0"}20`,
              backgroundColor: `${isSamsung ? brandColor : "#1428A0"}08`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "#1428A0" }}
              />
              <span className="text-sm font-semibold" style={{ color: "#1428A0" }}>
                삼성전자
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{samsungData.slogan}</p>
            <div className="space-y-1 text-[11px] text-gray-500">
              <p>파운드리: {samsungData.foundry.name} (수율 {samsungData.foundry.yield})</p>
              <p>패키징: {samsungData.packaging.name}</p>
              <p>{samsungData.division} · {samsungData.leader}</p>
            </div>
          </div>

          {/* Hynix summary */}
          <div
            className="rounded-xl border p-5"
            style={{
              borderColor: `${!isSamsung ? brandColor : "#E4002B"}20`,
              backgroundColor: `${!isSamsung ? brandColor : "#E4002B"}08`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "#E4002B" }}
              />
              <span className="text-sm font-semibold" style={{ color: "#E4002B" }}>
                SK하이닉스
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{hynixData.slogan}</p>
            <div className="space-y-1 text-[11px] text-gray-500">
              <p>HBM 점유율: ~70% (UBS)</p>
              <p>2024 영업이익: {hynixData.operatingProfit2024}</p>
              <p>미래기술: {hynixData.futureTech.map((t) => t.name).join(", ")}</p>
            </div>
          </div>
        </motion.div>

        {/* Data freshness footer */}
        <div className="mt-8 text-center text-[10px] text-gray-600">
          데이터 기준: {metricsData.updatedAt} · Perplexity + Gemini 파이프라인으로 자동 갱신
        </div>
      </div>
    </main>
  );
}
