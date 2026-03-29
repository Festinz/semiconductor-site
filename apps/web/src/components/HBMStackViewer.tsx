"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GENERATIONS = [
  {
    name: "HBM2E",
    year: 2018,
    layers: 8,
    capacity: "16GB",
    bandwidth: "460 GB/s",
    pinSpeed: "3.6 Gbps",
    color: "#6366f1",
  },
  {
    name: "HBM3",
    year: 2022,
    layers: 8,
    capacity: "24GB",
    bandwidth: "819 GB/s",
    pinSpeed: "6.4 Gbps",
    color: "#8b5cf6",
  },
  {
    name: "HBM3E",
    year: 2024,
    layers: 12,
    capacity: "36GB",
    bandwidth: "1.18 TB/s",
    pinSpeed: "9.6 Gbps",
    color: "#a855f7",
  },
  {
    name: "HBM4",
    year: 2026,
    layers: 12,
    capacity: "36GB",
    bandwidth: "~1.5 TB/s",
    pinSpeed: "11.7 Gbps",
    color: "#c084fc",
  },
  {
    name: "HBM4E",
    year: 2027,
    layers: 16,
    capacity: "48GB+",
    bandwidth: "4.0 TB/s",
    pinSpeed: "16 Gbps",
    color: "#e879f9",
  },
];

export default function HBMStackViewer() {
  const [selected, setSelected] = useState(3); // HBM4 default
  const gen = GENERATIONS[selected];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        HBM 적층 구조 — 세대별 비교
      </h3>

      {/* Generation tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {GENERATIONS.map((g, i) => (
          <button
            key={g.name}
            onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selected === i
                ? "text-white"
                : "text-gray-500 hover:text-gray-300 bg-gray-800/40"
            }`}
            style={
              selected === i
                ? { backgroundColor: `${g.color}25`, border: `1px solid ${g.color}50`, color: g.color }
                : undefined
            }
          >
            {g.name} ({g.year})
          </button>
        ))}
      </div>

      {/* SVG Stack Diagram */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.svg
              key={gen.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              viewBox="0 0 240 320"
              className="w-[200px] h-[280px]"
            >
              {/* Base die / Logic die */}
              <rect x="20" y="270" width="200" height="30" rx="4" fill="#374151" stroke="#4b5563" strokeWidth="1" />
              <text x="120" y="289" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="500">
                Logic / Base Die
              </text>

              {/* Interposer */}
              <rect x="10" y="305" width="220" height="12" rx="2" fill="#1f2937" stroke="#374151" strokeWidth="1" />
              <text x="120" y="314" textAnchor="middle" fill="#6b7280" fontSize="8">
                Silicon Interposer
              </text>

              {/* TSV pillars */}
              {[50, 90, 150, 190].map((x) => (
                <rect key={x} x={x - 2} y={270 - gen.layers * 18} width="4" height={gen.layers * 18} fill="#f59e0b" opacity="0.3" rx="1" />
              ))}

              {/* Memory layers */}
              {Array.from({ length: gen.layers }).map((_, i) => {
                const y = 270 - (i + 1) * 18;
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <rect
                      x="30"
                      y={y}
                      width="180"
                      height="15"
                      rx="2"
                      fill={gen.color}
                      opacity={0.15 + (i / gen.layers) * 0.5}
                      stroke={gen.color}
                      strokeWidth="0.5"
                      strokeOpacity="0.4"
                    />
                    <text x="120" y={y + 11} textAnchor="middle" fill={gen.color} fontSize="7" opacity="0.8">
                      DRAM {i + 1}
                    </text>
                    {/* TSV dots */}
                    {[50, 90, 150, 190].map((dx) => (
                      <circle key={dx} cx={dx} cy={y + 7.5} r="2" fill="#f59e0b" opacity="0.5" />
                    ))}
                  </motion.g>
                );
              })}

              {/* Top label */}
              <text x="120" y={270 - gen.layers * 18 - 10} textAnchor="middle" fill={gen.color} fontSize="11" fontWeight="600">
                {gen.name} — {gen.layers}-Hi Stack
              </text>

              {/* TSV label */}
              <text x="215" y={270 - gen.layers * 9} textAnchor="start" fill="#f59e0b" fontSize="7" opacity="0.7">
                TSV
              </text>
            </motion.svg>
          </AnimatePresence>
        </div>

        {/* Specs panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={gen.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "적층 수", value: `${gen.layers}-Hi` },
                { label: "용량", value: gen.capacity },
                { label: "대역폭", value: gen.bandwidth },
                { label: "핀속도", value: gen.pinSpeed },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-gray-800/40 p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: gen.color }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>TSV (Through Silicon Via): 실리콘 관통 전극으로 각 DRAM 다이를 수직 연결</p>
              <p>적층 수가 늘수록 용량과 대역폭 증가, 발열 관리가 핵심 과제</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
