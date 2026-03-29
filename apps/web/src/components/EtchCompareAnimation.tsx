"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EtchCompareAnimation() {
  const [mode, setMode] = useState<"wet" | "dry">("dry");
  const [running, setRunning] = useState(false);

  function startEtch() {
    setRunning(true);
    setTimeout(() => setRunning(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        Wet vs Dry 식각 비교
      </h3>
      <p className="text-[11px] text-gray-500 mb-5">
        등방성(Wet) vs 비등방성(Dry) — 식각 방향 차이를 확인하세요
      </p>

      {/* Toggle + Run button */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode("wet"); setRunning(false); }}
          className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
            mode === "wet"
              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
              : "bg-gray-800/30 border-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          Wet Etch (습식)
        </button>
        <button
          onClick={() => { setMode("dry"); setRunning(false); }}
          className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
            mode === "dry"
              ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
              : "bg-gray-800/30 border-gray-800 text-gray-500 hover:text-gray-300"
          }`}
        >
          Dry Etch (건식)
        </button>
        <button
          onClick={startEtch}
          disabled={running}
          className="px-4 py-2.5 rounded-xl text-xs font-medium border border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-all disabled:opacity-40"
        >
          {running ? "식각 중..." : "식각 시작"}
        </button>
      </div>

      {/* SVG Animation */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <svg viewBox="0 0 240 200" className="w-full max-w-[240px] flex-shrink-0">
          {/* Substrate */}
          <rect x="20" y="100" width="200" height="80" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="120" y="170" textAnchor="middle" fill="#475569" fontSize="10">기판 (막질)</text>

          {/* PR mask on top with opening */}
          <rect x="20" y="80" width="70" height="20" rx="2" fill="#92400e" opacity="0.6" />
          <rect x="150" y="80" width="70" height="20" rx="2" fill="#92400e" opacity="0.6" />
          <text x="55" y="94" textAnchor="middle" fill="#fbbf24" fontSize="7">PR Mask</text>
          <text x="185" y="94" textAnchor="middle" fill="#fbbf24" fontSize="7">PR Mask</text>

          {/* Etch profile */}
          {running && mode === "wet" && (
            <>
              {/* Wet: isotropic — etches sideways too (rounded bowl shape) */}
              <motion.ellipse
                cx="120" cy="100" rx="0" ry="0"
                fill="#0e7490" opacity="0.3"
                animate={{ rx: 55, ry: 40 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
              />
              <motion.ellipse
                cx="120" cy="100" rx="0" ry="0"
                fill="#083344" opacity="0.6"
                animate={{ rx: 50, ry: 35 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
              />
              {/* Undercut arrows */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                <line x1="80" y1="115" x2="65" y2="115" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#etchArrow)" />
                <line x1="160" y1="115" x2="175" y2="115" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#etchArrow)" />
                <text x="120" y="130" textAnchor="middle" fill="#22d3ee" fontSize="8">언더컷 발생!</text>
              </motion.g>
            </>
          )}
          {running && mode === "dry" && (
            <>
              {/* Dry: anisotropic — vertical only (rectangular trench) */}
              <motion.rect
                x="90" y="100" width="60" height="0" rx="1"
                fill="#ea580c" opacity="0.3"
                animate={{ height: 55 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.rect
                x="93" y="100" width="54" height="0" rx="1"
                fill="#431407" opacity="0.6"
                animate={{ height: 50 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              {/* Vertical arrows */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <line x1="120" y1="105" x2="120" y2="145" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#etchArrow)" />
                <text x="120" y="160" textAnchor="middle" fill="#fb923c" fontSize="8">수직 식각!</text>
              </motion.g>
            </>
          )}

          {!running && (
            <text x="120" y="130" textAnchor="middle" fill="#6b7280" fontSize="10">
              &ldquo;식각 시작&rdquo; 클릭
            </text>
          )}

          <defs>
            <marker id="etchArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={mode === "wet" ? "#22d3ee" : "#fb923c"} />
            </marker>
          </defs>
        </svg>

        {/* Info panel */}
        <div className="flex-1 space-y-3">
          {mode === "wet" ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-cyan-950/15 border border-cyan-500/15 p-3">
                <p className="text-xs font-semibold text-cyan-400 mb-1">Wet Etch (습식 식각)</p>
                <p className="text-xs text-gray-400">화학 용액에 담가서 제거 — 모든 방향으로 동일하게 식각 (등방성)</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-green-950/10 border border-green-500/10 p-2">
                  <p className="text-green-400 font-medium">장점</p>
                  <p className="text-gray-400">선택비 우수, 대량 처리</p>
                </div>
                <div className="rounded-lg bg-red-950/10 border border-red-500/10 p-2">
                  <p className="text-red-400 font-medium">단점</p>
                  <p className="text-gray-400">언더컷 → 미세 패턴 불리</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500">용도: 세정, 희생막 제거</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg bg-orange-950/15 border border-orange-500/15 p-3">
                <p className="text-xs font-semibold text-orange-400 mb-1">Dry Etch (건식 식각)</p>
                <p className="text-xs text-gray-400">플라즈마/가스로 제거 — 수직 방향만 식각 (비등방성)</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-green-950/10 border border-green-500/10 p-2">
                  <p className="text-green-400 font-medium">장점</p>
                  <p className="text-gray-400">수직 식각 → 미세 패턴 가능</p>
                </div>
                <div className="rounded-lg bg-red-950/10 border border-red-500/10 p-2">
                  <p className="text-red-400 font-medium">단점</p>
                  <p className="text-gray-400">장비 비용↑, 플라즈마 데미지</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500">용도: 게이트·콘택 식각 등 핵심 공정</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
