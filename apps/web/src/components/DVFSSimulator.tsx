"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const MODES = [
  {
    name: "게이밍 / AI",
    icon: "🎮",
    voltage: 1.1,
    frequency: 8533,
    power: 100,
    description: "최대 성능 — 전압·주파수 모두 최고치",
    color: "#ef4444",
  },
  {
    name: "일반 사용",
    icon: "💻",
    voltage: 0.85,
    frequency: 6400,
    power: 60,
    description: "균형 모드 — 성능과 효율의 최적점",
    color: "#f59e0b",
  },
  {
    name: "절전 / 대기",
    icon: "🔋",
    voltage: 0.6,
    frequency: 3200,
    power: 25,
    description: "최소 전력 — 부하가 없을 때 자동 전환",
    color: "#22c55e",
  },
];

export default function DVFSSimulator() {
  const [modeIndex, setModeIndex] = useState(1);
  const mode = MODES[modeIndex];

  // Continuous slider position 0~100
  const sliderPos = modeIndex * 50; // 0, 50, 100

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        DVFS 시뮬레이터 (LPDDR6)
      </h3>
      <p className="text-[11px] text-gray-500 mb-5">
        Dynamic Voltage and Frequency Scaling — 부하에 따라 전압/주파수를 실시간 조절
      </p>

      {/* Mode buttons */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {MODES.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setModeIndex(i)}
            className={`relative rounded-xl p-3 text-center transition-all ${
              modeIndex === i
                ? "border"
                : "bg-gray-800/30 border border-gray-800 hover:border-gray-700"
            }`}
            style={
              modeIndex === i
                ? { backgroundColor: `${m.color}10`, borderColor: `${m.color}40` }
                : undefined
            }
          >
            <span className="text-xl block mb-1">{m.icon}</span>
            <span className="text-[11px] font-medium block" style={modeIndex === i ? { color: m.color } : { color: "#9ca3af" }}>
              {m.name}
            </span>
          </button>
        ))}
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Voltage */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">전압</p>
          <div className="relative w-20 h-20 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={mode.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - mode.voltage / 1.2) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: mode.color }}>
                {mode.voltage}V
              </span>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">주파수</p>
          <div className="relative w-20 h-20 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={mode.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - mode.frequency / 9000) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: mode.color }}>
                {(mode.frequency / 1000).toFixed(1)}GHz
              </span>
            </div>
          </div>
        </div>

        {/* Power */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">전력 소비</p>
          <div className="relative w-20 h-20 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={mode.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - mode.power / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: mode.color }}>
                {mode.power}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <motion.div
        key={mode.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg p-3 border"
        style={{ backgroundColor: `${mode.color}08`, borderColor: `${mode.color}20` }}
      >
        <p className="text-xs text-gray-300">{mode.description}</p>
        <p className="text-[10px] text-gray-500 mt-1">
          DVFS 미적용 시 항상 최대 전력(100%) 소비 → DVFS로 {100 - mode.power}% 절감 가능
        </p>
      </motion.div>

      {/* Samsung vs Hynix note */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-[10px]">
        <div className="rounded-lg bg-red-950/10 border border-red-500/10 p-2.5">
          <span className="text-red-400 font-medium">SK하이닉스:</span>
          <span className="text-gray-400 ml-1">DVFS 적용 — 전력 20%↓</span>
        </div>
        <div className="rounded-lg bg-blue-950/10 border border-blue-500/10 p-2.5">
          <span className="text-blue-400 font-medium">삼성전자:</span>
          <span className="text-gray-400 ml-1">DVFS 미적용</span>
        </div>
      </div>
    </div>
  );
}
