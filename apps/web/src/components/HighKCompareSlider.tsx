"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function HighKCompareSlider() {
  const [thickness, setThickness] = useState(50);

  // SiO2: k=3.9, HfO2: k~20
  const sio2K = 3.9;
  const hfo2K = 20;
  // Physical thickness slider: 1nm to 5nm
  const physicalThickness = 1 + (thickness / 100) * 4; // 1~5nm
  const eotSiO2 = physicalThickness; // EOT = physical for SiO2
  const eotHfO2 = physicalThickness * (sio2K / hfo2K); // EOT for HfO2

  // Tunneling probability (simplified exponential)
  const tunnelingS = Math.min(100, Math.exp(4 - physicalThickness * 1.5) * 10);
  const tunnelingH = Math.min(100, Math.exp(4 - physicalThickness * 1.5) * 0.3);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-1">
        High-K vs SiO₂ — 유전율 비교
      </h3>
      <p className="text-[11px] text-gray-500 mb-5">
        같은 물리적 두께에서의 전기적 특성 차이를 확인하세요
      </p>

      {/* Slider */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] text-gray-500 mb-2">
          <span>물리적 두께: {physicalThickness.toFixed(1)} nm</span>
          <span>1nm — 5nm</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={thickness}
          onChange={(e) => setThickness(Number(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Comparison visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* SiO2 */}
        <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm bg-gray-500" />
            <span className="text-xs font-semibold text-gray-300">SiO₂ (기존)</span>
          </div>
          <div className="flex items-end gap-4 mb-3">
            {/* Gate bar */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-gray-600 mb-1">Gate</span>
              <div className="w-16 bg-gray-600 rounded-sm" style={{ height: 60 }} />
            </div>
            {/* Oxide layer */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-gray-600 mb-1">산화막</span>
              <motion.div
                className="w-16 bg-amber-700/60 rounded-sm border border-amber-600/30"
                animate={{ height: Math.max(8, physicalThickness * 12) }}
                transition={{ duration: 0.2 }}
              />
            </div>
            {/* Channel */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-gray-600 mb-1">채널</span>
              <div className="w-16 bg-blue-900/40 rounded-sm" style={{ height: 30 }} />
            </div>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">유전율 (k)</span>
              <span className="text-gray-300">{sio2K}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">EOT</span>
              <span className="text-gray-300">{eotSiO2.toFixed(2)} nm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">터널링 확률</span>
              <span className="text-red-400 font-semibold">{tunnelingS.toFixed(1)}%</span>
            </div>
          </div>
          {/* Tunneling bar */}
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500 rounded-full"
              animate={{ width: `${tunnelingS}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* HfO2 */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-sm bg-blue-500" />
            <span className="text-xs font-semibold text-blue-300">HfO₂ (High-K)</span>
          </div>
          <div className="flex items-end gap-4 mb-3">
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-gray-600 mb-1">Metal Gate</span>
              <div className="w-16 bg-blue-600/60 rounded-sm" style={{ height: 60 }} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-gray-600 mb-1">High-K</span>
              <motion.div
                className="w-16 bg-blue-500/40 rounded-sm border border-blue-400/30"
                animate={{ height: Math.max(8, physicalThickness * 12) }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-gray-600 mb-1">채널</span>
              <div className="w-16 bg-blue-900/40 rounded-sm" style={{ height: 30 }} />
            </div>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">유전율 (k)</span>
              <span className="text-blue-300">{hfo2K}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">EOT</span>
              <span className="text-blue-300">{eotHfO2.toFixed(2)} nm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">터널링 확률</span>
              <span className="text-emerald-400 font-semibold">{tunnelingH.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              animate={{ width: `${tunnelingH}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div className="rounded-lg bg-blue-950/20 border border-blue-500/10 p-3">
        <p className="text-[11px] text-gray-400">
          <span className="text-blue-400 font-semibold">EOT 공식:</span>{" "}
          t_physical x (k_SiO₂ / k_high) = {physicalThickness.toFixed(1)} x ({sio2K} / {hfo2K}) ={" "}
          <span className="text-blue-300 font-semibold">{eotHfO2.toFixed(2)} nm</span>
        </p>
        <p className="text-[10px] text-gray-500 mt-1">
          같은 물리적 두께 {physicalThickness.toFixed(1)}nm에서 HfO₂는 전기적으로{" "}
          {eotHfO2.toFixed(2)}nm SiO₂와 동일 → 터널링 누설 {((1 - tunnelingH / Math.max(tunnelingS, 0.01)) * 100).toFixed(0)}% 감소
        </p>
      </div>
    </div>
  );
}
