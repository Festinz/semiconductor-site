"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import fundamentalsData from "@/data/fundamentals.json";

const data = fundamentalsData.topics.find((t) => t.id === "leakage-current") as any;

const SEVERITY_COLOR: Record<string, string> = {
  "신뢰성 이슈 (시간 경과에 따른 열화)": "text-yellow-400",
  "미세화의 최대 장벽 중 하나": "text-red-400",
  "전력 소비 직접 증가": "text-orange-400",
  "DRAM Retention time 저하의 주범": "text-red-500",
  "소자 완전 고장": "text-red-600",
};

const EVO_COLOR: Record<string, string> = {
  "초기": "border-gray-600",
  "중기": "border-yellow-600",
  "현재": "border-blue-600",
  "최신": "border-green-600",
};

export default function LeakageCurrentPage() {
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
            <h1 className="text-lg font-bold text-red-400">{data.title}</h1>
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

        {/* 5 Leakage Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-bold text-gray-200 mb-4">5가지 누설전류 유형</h2>
          <div className="space-y-4">
            {data.types.map((type: any, i: number) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="rounded-xl border border-gray-800 bg-gray-900/60 p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-400/60">{i + 1}</span>
                    <h3 className="text-sm font-bold text-gray-200">{type.name}</h3>
                  </div>
                  <span className={`text-[10px] ${SEVERITY_COLOR[type.severity] || "text-gray-400"}`}>
                    {type.severity}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{type.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-red-950/10 border border-red-500/10 p-3">
                    <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1 font-medium">원인</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{type.cause}</p>
                  </div>
                  <div className="rounded-lg bg-green-950/10 border border-green-500/10 p-3">
                    <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1 font-medium">솔루션</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{type.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Evolution Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-bold text-gray-200 mb-4">솔루션 진화 타임라인</h2>
          <div className="flex flex-col md:flex-row gap-3">
            {data.solutionEvolution.map((evo: any, i: number) => (
              <div
                key={evo.era}
                className={`flex-1 rounded-xl border-l-4 ${EVO_COLOR[evo.era] || "border-gray-600"} bg-gray-900/40 p-4`}
              >
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{evo.era}</p>
                <p className="text-xs font-bold text-gray-200 mb-1">{evo.solution}</p>
                <p className="text-[10px] text-gray-500">대상: {evo.target}</p>
                {i < data.solutionEvolution.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 text-gray-600">→</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interview Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-green-500/15 bg-green-950/5 p-6"
        >
          <h2 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
            면접 포인트
          </h2>
          <div className="space-y-2.5">
            {data.interviewPoints.map((point: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-green-500/60 mt-0.5 flex-shrink-0">•</span>
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Links */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/fundamentals/mosfet-evolution"
            className="text-[10px] px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/15 hover:bg-purple-500/20 transition-colors"
          >
            MOSFET 변천사 →
          </Link>
          <Link
            href="/fundamentals/high-k-metal-gate"
            className="text-[10px] px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15 hover:bg-blue-500/20 transition-colors"
          >
            High-K Metal Gate →
          </Link>
        </div>
      </div>
    </main>
  );
}
