"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import fundamentalsData from "@/data/fundamentals.json";

const data = fundamentalsData.topics.find((t) => t.id === "mosfet-evolution")!;
const generations = data.generations as any[];
const GEN_COLORS = ["#6b7280", "#8b5cf6", "#22c55e"];

function GateSVG({ index }: { index: number }) {
  const color = GEN_COLORS[index];
  // Animated arrows to show gate control directions
  const arrowProps = { stroke: color, strokeWidth: 2, fill: "none", markerEnd: "url(#arrowHead)" };

  return (
    <svg viewBox="0 0 260 200" className="w-full max-w-[260px]">
      <defs>
        <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={color} />
        </marker>
      </defs>

      {index === 0 && (
        <>
          {/* Planar MOSFET */}
          <rect x="30" y="130" width="200" height="40" rx="4" fill="#1e3a5f" opacity="0.3" />
          <text x="130" y="155" textAnchor="middle" fill="#60a5fa" fontSize="10">Si 기판 (Substrate)</text>
          {/* Source / Drain */}
          <rect x="40" y="105" width="50" height="25" rx="3" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
          <text x="65" y="121" textAnchor="middle" fill="#9ca3af" fontSize="8">Source</text>
          <rect x="170" y="105" width="50" height="25" rx="3" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />
          <text x="195" y="121" textAnchor="middle" fill="#9ca3af" fontSize="8">Drain</text>
          {/* Channel */}
          <rect x="90" y="112" width="80" height="18" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
          <text x="130" y="125" textAnchor="middle" fill="#94a3b8" fontSize="8">채널</text>
          {/* Gate oxide */}
          <rect x="90" y="100" width="80" height="12" rx="1" fill="#92400e" opacity="0.4" />
          <text x="130" y="109" textAnchor="middle" fill="#fbbf24" fontSize="6">SiO₂</text>
          {/* Gate */}
          <rect x="95" y="65" width="70" height="35" rx="4" fill={color} opacity="0.5" stroke={color} strokeWidth="1.5" />
          <text x="130" y="87" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Gate</text>
          {/* 1-direction arrow — top only */}
          <motion.line
            x1="130" y1="60" x2="130" y2="40"
            {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <text x="130" y="35" textAnchor="middle" fill={color} fontSize="9" fontWeight="600">1면 제어 ↓</text>
          {/* Control highlight — bottom of gate only */}
          <motion.line
            x1="95" y1="100" x2="165" y2="100"
            stroke={color} strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
        </>
      )}

      {index === 1 && (
        <>
          {/* FinFET */}
          <rect x="30" y="145" width="200" height="35" rx="4" fill="#1e3a5f" opacity="0.3" />
          <text x="130" y="167" textAnchor="middle" fill="#60a5fa" fontSize="10">Si 기판</text>
          {/* Fin (vertical channel) */}
          <rect x="115" y="55" width="30" height="90" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
          <text x="130" y="105" textAnchor="middle" fill="#94a3b8" fontSize="7" transform="rotate(-90 130 105)">Channel (Fin)</text>
          {/* Gate wrapping 3 sides */}
          <motion.path
            d="M85 55 L115 55 L115 145 L85 145"
            fill={`${color}15`} stroke={color} strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.path
            d="M145 55 L175 55 L175 145 L145 145"
            fill={`${color}15`} stroke={color} strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <motion.rect
            x="85" y="45" width="90" height="12" rx="3"
            fill={`${color}30`} stroke={color} strokeWidth="1.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          <text x="130" y="54" textAnchor="middle" fill={color} fontSize="8" fontWeight="600">Gate (상단)</text>
          {/* 3-direction arrows */}
          <motion.line x1="78" y1="100" x2="62" y2="100" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
          <motion.line x1="130" y1="38" x2="130" y2="22" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.7 }} />
          <motion.line x1="182" y1="100" x2="198" y2="100" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.8 }} />
          <text x="130" y="17" textAnchor="middle" fill={color} fontSize="9" fontWeight="600">3면 제어</text>
          {/* Highlight lines on 3 sides */}
          <motion.line x1="85" y1="55" x2="85" y2="145" stroke={color} strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.5 }} />
          <motion.line x1="175" y1="55" x2="175" y2="145" stroke={color} strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.6 }} />
          <motion.line x1="85" y1="45" x2="175" y2="45" stroke={color} strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.7 }} />
        </>
      )}

      {index === 2 && (
        <>
          {/* GAA / MBCFET — stacked nanosheets */}
          <rect x="30" y="160" width="200" height="25" rx="4" fill="#1e3a5f" opacity="0.3" />
          <text x="130" y="177" textAnchor="middle" fill="#60a5fa" fontSize="9">Si 기판</text>
          {[0, 1, 2].map((i) => {
            const y = 50 + i * 35;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
              >
                {/* Gate (4면 감쌈) */}
                <rect x="55" y={y - 5} width="150" height="30" rx="5"
                  fill={`${color}08`} stroke={color} strokeWidth="1.5" strokeDasharray="0" />
                {/* Nanosheet channel */}
                <rect x="75" y={y + 3} width="110" height="14" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                <text x="130" y={y + 13} textAnchor="middle" fill="#d1d5db" fontSize="8">
                  Nanosheet {i + 1}
                </text>
                {/* 4-direction highlights */}
                <motion.line x1="55" y1={y + 10} x2="55" y2={y + 10} stroke={color} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ y1: y + 10, y2: y + 10 }} animate={{ y1: y - 3, y2: y + 23 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }} />
                <motion.line x1="205" y1={y + 10} x2="205" y2={y + 10} stroke={color} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ y1: y + 10, y2: y + 10 }} animate={{ y1: y - 3, y2: y + 23 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }} />
                <motion.line x1="130" y1={y - 5} x2="130" y2={y - 5} stroke={color} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ x1: 130, x2: 130 }} animate={{ x1: 57, x2: 203 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }} />
                <motion.line x1="130" y1={y + 25} x2="130" y2={y + 25} stroke={color} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ x1: 130, x2: 130 }} animate={{ x1: 57, x2: 203 }}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }} />
              </motion.g>
            );
          })}
          <text x="130" y="30" textAnchor="middle" fill={color} fontSize="10" fontWeight="700">4면 완전 제어 (GAA)</text>
          {/* 4 arrows */}
          <motion.line x1="40" y1="95" x2="25" y2="95" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1 }} />
          <motion.line x1="220" y1="95" x2="235" y2="95" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.1 }} />
          <motion.line x1="130" y1="42" x2="130" y2="32" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.2 }} />
          <motion.line x1="130" y1="153" x2="130" y2="158" {...arrowProps}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.3 }} />
        </>
      )}
    </svg>
  );
}

export default function MosfetEvolutionPage() {
  const [selected, setSelected] = useState(0);
  const gen = generations[selected];

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
            <h1 className="text-lg font-bold text-green-500">{data.title}</h1>
            <p className="text-xs text-gray-500">{data.subtitle}</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Analogy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">🚿</span>
            <div>
              <h2 className="text-base font-semibold text-gray-200 mb-1">쉽게 말하면...</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{data.analogy}</p>
            </div>
          </div>
        </motion.div>

        {/* 3-column clickable structure cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3"
        >
          {generations.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setSelected(i)}
              className={`rounded-2xl border p-4 text-center transition-all ${
                selected === i
                  ? "bg-gray-900/80"
                  : "bg-gray-900/30 border-gray-800 hover:border-gray-700"
              }`}
              style={
                selected === i
                  ? { borderColor: `${GEN_COLORS[i]}50`, boxShadow: `0 0 20px ${GEN_COLORS[i]}10` }
                  : undefined
              }
            >
              <div
                className="text-3xl font-black mb-1"
                style={{ color: selected === i ? GEN_COLORS[i] : "#4b5563" }}
              >
                {g.gateSides}면
              </div>
              <p className="text-xs font-semibold text-gray-300">{g.name}</p>
              <p className="text-[10px] text-gray-500">{g.era}</p>
            </button>
          ))}
        </motion.div>

        {/* SVG + Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 bg-gray-950/60 rounded-xl p-4 border border-gray-800/50">
                <GateSVG index={selected} />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold" style={{ color: GEN_COLORS[selected] }}>
                  {gen.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full border font-medium"
                    style={{ borderColor: `${GEN_COLORS[selected]}40`, color: GEN_COLORS[selected] }}
                  >
                    게이트 {gen.gateSides}면 접촉
                  </span>
                  <span className="text-xs text-gray-500">{gen.era}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{gen.description}</p>
                <p className="text-xs text-gray-500 italic">비유: {gen.analogy}</p>

                {gen.limitation && (
                  <div className="rounded-lg bg-red-950/15 border border-red-500/15 p-3 text-xs text-red-400/80">
                    <span className="font-semibold">한계:</span> {gen.limitation}
                  </div>
                )}
                {gen.advantage && (
                  <div className="rounded-lg bg-green-950/15 border border-green-500/15 p-3 text-xs text-green-400/80">
                    <span className="font-semibold">장점:</span> {gen.advantage}
                  </div>
                )}
                {gen.samsung && (
                  <div className="rounded-lg bg-blue-950/15 border border-blue-500/15 p-3 text-xs text-blue-300/80">
                    <span className="font-semibold">삼성 {gen.samsung.name}:</span>{" "}
                    {gen.samsung.node} · 수율 {gen.samsung.yield2026} · {gen.samsung.tsmcComparison}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Evolution flow */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {generations.map((g, i) => (
            <div key={g.name} className="flex items-center gap-2">
              <button
                onClick={() => setSelected(i)}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105"
                style={{
                  borderColor: `${GEN_COLORS[i]}40`,
                  backgroundColor: selected === i ? `${GEN_COLORS[i]}15` : "transparent",
                  color: GEN_COLORS[i],
                }}
              >
                {g.name} ({g.gateSides}면)
              </button>
              {i < generations.length - 1 && (
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <div className="px-3 py-1.5 rounded-lg border border-dashed border-gray-700 text-xs text-gray-500">
            CFET (미래)
          </div>
        </div>

        {/* Interview points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-green-500/15 bg-green-950/10 p-6"
        >
          <h2 className="text-base font-semibold text-green-400 mb-4 flex items-center gap-2">
            <span>★</span> 면접 포인트
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

      </div>
    </main>
  );
}
