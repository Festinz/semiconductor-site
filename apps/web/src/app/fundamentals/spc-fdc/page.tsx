"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import fundamentalsData from "@/data/fundamentals.json";

const data = fundamentalsData.topics.find((t) => t.id === "spc-fdc") as any;

const DATA_COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function SpcFdcPage() {
  const [activeTab, setActiveTab] = useState<"spc" | "fdc">("spc");

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
            <h1 className="text-lg font-bold text-amber-400">{data.title}</h1>
            <p className="text-xs text-gray-500">{data.subtitle}</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Summary + Analogy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{data.summary}</p>
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">
            <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1 font-medium">비유로 이해하기</p>
            <p className="text-xs text-gray-400 leading-relaxed">{data.analogy}</p>
          </div>
        </motion.div>

        {/* SPC vs FDC Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2 mb-4">
            {(["spc", "fdc"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-500 bg-gray-900/30 hover:text-gray-300"
                }`}
              >
                {tab === "spc" ? "SPC (결과 기반)" : "FDC (원인 기반)"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "spc" ? (
              <motion.div
                key="spc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-blue-500/15 bg-gray-900/60 p-6"
              >
                <h3 className="text-sm font-bold text-blue-400 mb-1">{data.spc.name}</h3>
                <p className="text-[10px] text-gray-500 mb-3">{data.spc.fullName}</p>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">{data.spc.description}</p>

                <div className="space-y-3">
                  {data.spc.keyComponents.map((comp: any) => (
                    <div key={comp.name} className="rounded-lg bg-blue-950/10 border border-blue-500/10 p-3">
                      <p className="text-xs font-medium text-blue-300 mb-1">{comp.name}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="fdc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-orange-500/15 bg-gray-900/60 p-6"
              >
                <h3 className="text-sm font-bold text-orange-400 mb-1">{data.fdc.name}</h3>
                <p className="text-[10px] text-gray-500 mb-3">{data.fdc.fullName}</p>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">{data.fdc.description}</p>

                <div className="rounded-lg bg-orange-950/10 border border-orange-500/10 p-3 mb-3">
                  <p className="text-[10px] text-orange-400 uppercase tracking-wider mb-2 font-medium">수집 데이터 유형</p>
                  <div className="flex flex-wrap gap-2">
                    {data.fdc.dataTypes.map((dt: string) => (
                      <span key={dt} className="text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-400">
                        {dt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800/30 p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium">처리 프로세스</p>
                  <p className="text-xs text-gray-400">{data.fdc.process}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 4 Data Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-bold text-gray-200 mb-4">반도체 데이터 4종류</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.fourDataTypes.map((dt: any, i: number) => (
              <motion.div
                key={dt.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="rounded-xl border border-gray-800 bg-gray-900/60 p-5"
                style={{ borderLeftWidth: 4, borderLeftColor: DATA_COLORS[i] }}
              >
                <h3 className="text-xs font-bold text-gray-200 mb-1">{dt.name}</h3>
                <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">{dt.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {dt.examples.map((ex: string) => (
                    <span
                      key={ex}
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${DATA_COLORS[i]}10`, color: DATA_COLORS[i], border: `1px solid ${DATA_COLORS[i]}20` }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-gray-500">활용: {dt.usage}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Expansion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-purple-500/15 bg-purple-950/5 p-5"
        >
          <h3 className="text-xs font-bold text-purple-400 mb-2">AI/ML 확장 트렌드</h3>
          <p className="text-xs text-gray-400 mb-2 leading-relaxed">{data.aiExpansion.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg bg-purple-950/10 border border-purple-500/10 p-3">
              <p className="text-[10px] text-purple-400 mb-1 font-medium">접근 방식</p>
              <p className="text-[11px] text-gray-400">{data.aiExpansion.approach}</p>
            </div>
            <div className="rounded-lg bg-purple-950/10 border border-purple-500/10 p-3">
              <p className="text-[10px] text-purple-400 mb-1 font-medium">기대 효과</p>
              <p className="text-[11px] text-gray-400">{data.aiExpansion.benefit}</p>
            </div>
          </div>
        </motion.div>

        {/* Interview Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-green-500/15 bg-green-950/5 p-6"
        >
          <h2 className="text-sm font-bold text-green-400 mb-3">면접 포인트</h2>
          <div className="space-y-2.5">
            {data.interviewPoints.map((point: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-green-500/60 mt-0.5 flex-shrink-0">•</span>
                {point}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
