"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GDDR7DiagramViewer() {
  const [showHynix, setShowHynix] = useState(false);

  const samsungCap = 36;
  const hynixCap = 48;
  const chipCount = 8; // 4 per side

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        GPU 위 GDDR7 배치 다이어그램
      </h3>
      <p className="text-[11px] text-gray-500 mb-5">
        GPU 양쪽에 GDDR7 칩이 4개씩 배치됩니다. 삼성 vs 하이닉스 용량을 비교하세요.
      </p>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowHynix(false)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            !showHynix
              ? "bg-blue-500/15 border border-blue-500/30 text-blue-400"
              : "bg-gray-800/40 text-gray-500 hover:text-gray-300"
          }`}
        >
          삼성 ({samsungCap}GB x{chipCount} = {samsungCap * chipCount}GB)
        </button>
        <button
          onClick={() => setShowHynix(true)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            showHynix
              ? "bg-red-500/15 border border-red-500/30 text-red-400"
              : "bg-gray-800/40 text-gray-500 hover:text-gray-300"
          }`}
        >
          하이닉스 ({hynixCap}GB x{chipCount} = {hynixCap * chipCount}GB)
        </button>
      </div>

      {/* SVG Diagram */}
      <svg viewBox="0 0 500 220" className="w-full max-w-lg mx-auto">
        {/* GPU die center */}
        <rect x="170" y="60" width="160" height="100" rx="8" fill="#1f2937" stroke="#4b5563" strokeWidth="1.5" />
        <text x="250" y="105" textAnchor="middle" fill="#9ca3af" fontSize="12" fontWeight="600">
          GPU Die
        </text>
        <text x="250" y="122" textAnchor="middle" fill="#6b7280" fontSize="9">
          (AI Accelerator)
        </text>

        {/* Left side chips (4) */}
        {[0, 1, 2, 3].map((i) => {
          const y = 45 + i * 38;
          const chipColor = showHynix ? "#E4002B" : "#1428A0";
          const cap = showHynix ? hynixCap : samsungCap;
          return (
            <motion.g key={`left-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <rect x="20" y={y} width="120" height="30" rx="4" fill={`${chipColor}20`} stroke={chipColor} strokeWidth="1" strokeOpacity="0.4" />
              <text x="80" y={y + 18} textAnchor="middle" fill={chipColor} fontSize="9" fontWeight="500">
                GDDR7 {cap}GB
              </text>
              {/* Connection line */}
              <line x1="140" y1={y + 15} x2="170" y2={85 + i * 10} stroke="#4b5563" strokeWidth="1" strokeDasharray="3 2" />
            </motion.g>
          );
        })}

        {/* Right side chips (4) */}
        {[0, 1, 2, 3].map((i) => {
          const y = 45 + i * 38;
          const chipColor = showHynix ? "#E4002B" : "#1428A0";
          const cap = showHynix ? hynixCap : samsungCap;
          return (
            <motion.g key={`right-${i}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.2 }}>
              <rect x="360" y={y} width="120" height="30" rx="4" fill={`${chipColor}20`} stroke={chipColor} strokeWidth="1" strokeOpacity="0.4" />
              <text x="420" y={y + 18} textAnchor="middle" fill={chipColor} fontSize="9" fontWeight="500">
                GDDR7 {cap}GB
              </text>
              <line x1="360" y1={y + 15} x2="330" y2={85 + i * 10} stroke="#4b5563" strokeWidth="1" strokeDasharray="3 2" />
            </motion.g>
          );
        })}

        {/* Total label */}
        <text x="250" y="200" textAnchor="middle" fill={showHynix ? "#E4002B" : "#1428A0"} fontSize="11" fontWeight="600">
          총 {(showHynix ? hynixCap : samsungCap) * chipCount}GB
          {showHynix && " (세계 최초 48GB/칩)"}
        </text>
      </svg>

      {/* Capacity comparison bar */}
      <div className="mt-4 rounded-lg bg-gray-800/30 p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-blue-400">삼성</span>
              <span className="text-gray-400">{samsungCap * chipCount}GB</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500/60 rounded-full"
                animate={{ width: `${(samsungCap / hynixCap) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-red-400">하이닉스</span>
              <span className="text-gray-400">{hynixCap * chipCount}GB</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-red-500/60 rounded-full" animate={{ width: "100%" }} />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 text-center">
          하이닉스 GDDR7 48GB는 삼성 36GB 대비 +33% 용량 — 동일 핀속도 32Gbps
        </p>
      </div>
    </div>
  );
}
