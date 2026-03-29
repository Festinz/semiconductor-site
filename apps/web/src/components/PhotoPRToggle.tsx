"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PhotoPRToggle() {
  const [isPositive, setIsPositive] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        PR (감광제) Positive vs Negative
      </h3>
      <p className="text-[11px] text-gray-500 mb-5">
        빛을 받은 부분이 녹는가(Positive) vs 남는가(Negative) — 토글로 비교하세요
      </p>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setIsPositive(true)}
          className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
            isPositive
              ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
              : "bg-gray-800/30 border-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          Positive PR (현재 주류)
        </button>
        <button
          onClick={() => setIsPositive(false)}
          className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
            !isPositive
              ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
              : "bg-gray-800/30 border-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          Negative PR
        </button>
      </div>

      {/* SVG Diagram */}
      <svg viewBox="0 0 500 220" className="w-full max-w-lg mx-auto mb-4">
        {/* Step labels */}
        <text x="85" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="500">1. 도포</text>
        <text x="250" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="500">2. 노광 (빛)</text>
        <text x="415" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="500">3. 현상 후</text>

        {/* Step 1: PR coated */}
        <rect x="20" y="120" width="130" height="30" rx="3" fill="#374151" />
        <text x="85" y="140" textAnchor="middle" fill="#9ca3af" fontSize="9">기판</text>
        <rect x="20" y="90" width="130" height="30" rx="3" fill={isPositive ? "#3b82f6" : "#a855f7"} opacity="0.5" />
        <text x="85" y="109" textAnchor="middle" fill="white" fontSize="9">PR 전체 도포</text>

        {/* Step 2: Exposure */}
        <rect x="185" y="120" width="130" height="30" rx="3" fill="#374151" />
        <text x="250" y="140" textAnchor="middle" fill="#9ca3af" fontSize="9">기판</text>
        {/* Unexposed parts */}
        <rect x="185" y="90" width="40" height="30" rx="2" fill={isPositive ? "#3b82f6" : "#a855f7"} opacity="0.5" />
        <rect x="275" y="90" width="40" height="30" rx="2" fill={isPositive ? "#3b82f6" : "#a855f7"} opacity="0.5" />
        {/* Exposed part (center) — highlighted */}
        <motion.rect
          x="225" y="90" width="50" height="30" rx="2"
          fill={isPositive ? "#3b82f6" : "#a855f7"}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <text x="250" y="109" textAnchor="middle" fill="white" fontSize="8">빛 받은 부분</text>
        {/* Light rays */}
        {[235, 245, 255, 265].map((lx) => (
          <motion.line
            key={lx}
            x1={lx} y1="30" x2={lx} y2="85"
            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: (lx - 235) * 0.1 }}
          />
        ))}
        <text x="250" y="75" textAnchor="middle" fill="#fbbf24" fontSize="8">UV/EUV</text>
        {/* Mask */}
        <rect x="220" y="55" width="60" height="8" rx="2" fill="#1f2937" stroke="#6b7280" strokeWidth="0.5" />
        <rect x="233" y="55" width="34" height="8" fill="transparent" />
        <text x="250" y="52" textAnchor="middle" fill="#6b7280" fontSize="7">Mask</text>

        {/* Step 3: After develop */}
        <rect x="350" y="120" width="130" height="30" rx="3" fill="#374151" />
        <text x="415" y="140" textAnchor="middle" fill="#9ca3af" fontSize="9">기판</text>
        {isPositive ? (
          <>
            {/* Positive: exposed part dissolved → gap */}
            <rect x="350" y="90" width="40" height="30" rx="2" fill="#3b82f6" opacity="0.5" />
            <rect x="440" y="90" width="40" height="30" rx="2" fill="#3b82f6" opacity="0.5" />
            {/* Gap where exposed was */}
            <rect x="390" y="90" width="50" height="30" rx="2" fill="transparent" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" opacity="0.3" />
            <text x="415" y="109" textAnchor="middle" fill="#60a5fa" fontSize="7">녹아서 제거됨</text>
          </>
        ) : (
          <>
            {/* Negative: unexposed dissolved → only exposed remains */}
            <rect x="350" y="90" width="40" height="30" rx="2" fill="transparent" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" opacity="0.3" />
            <rect x="440" y="90" width="40" height="30" rx="2" fill="transparent" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" opacity="0.3" />
            <rect x="390" y="90" width="50" height="30" rx="2" fill="#a855f7" opacity="0.5" />
            <text x="415" y="109" textAnchor="middle" fill="#c084fc" fontSize="7">빛 받은 부분 남음</text>
          </>
        )}

        {/* Arrows */}
        <line x1="155" y1="105" x2="180" y2="105" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#prArrow)" />
        <line x1="320" y1="105" x2="345" y2="105" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#prArrow)" />
        <defs>
          <marker id="prArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#4b5563" />
          </marker>
        </defs>

        {/* Result label */}
        <rect x="350" y="160" width="130" height="30" rx="6"
          fill={isPositive ? "#1e3a8a" : "#581c87"} opacity="0.2"
          stroke={isPositive ? "#3b82f6" : "#a855f7"} strokeWidth="1" />
        <text x="415" y="179" textAnchor="middle"
          fill={isPositive ? "#60a5fa" : "#c084fc"} fontSize="9" fontWeight="500">
          {isPositive ? "빛 받은 부분 제거 (Positive)" : "빛 받은 부분 보존 (Negative)"}
        </text>
      </svg>

      {/* Key info */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className={`rounded-lg border p-3 ${isPositive ? "border-blue-500/20 bg-blue-950/10" : "border-gray-800 bg-gray-800/20"}`}>
          <p className={`font-medium mb-1 ${isPositive ? "text-blue-400" : "text-gray-500"}`}>Positive PR</p>
          <p className="text-gray-400">빛 받은 부분 → 녹음 (제거됨)</p>
          <p className="text-[10px] text-gray-500 mt-1">현재 주류 — 미세 패턴에 유리</p>
        </div>
        <div className={`rounded-lg border p-3 ${!isPositive ? "border-purple-500/20 bg-purple-950/10" : "border-gray-800 bg-gray-800/20"}`}>
          <p className={`font-medium mb-1 ${!isPositive ? "text-purple-400" : "text-gray-500"}`}>Negative PR</p>
          <p className="text-gray-400">빛 받은 부분 → 남음 (경화됨)</p>
          <p className="text-[10px] text-gray-500 mt-1">특수 용도 (리프트오프 등)</p>
        </div>
      </div>
    </div>
  );
}
