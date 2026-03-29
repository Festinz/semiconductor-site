"use client";

import { motion } from "framer-motion";

interface JEDECProgressBarProps {
  achieved: number;
  target: number;
  unit: string;
  color: string;
  label?: string;
}

export default function JEDECProgressBar({
  achieved,
  target,
  unit,
  color,
  label = "JEDEC 달성률",
}: JEDECProgressBarProps) {
  const percentage = Math.min((achieved / target) * 100, 200);
  const displayPercent = Math.round(percentage);
  const overTarget = achieved > target;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] text-gray-400">
          {achieved} / {target} {unit}
          <span className="ml-1 font-semibold" style={{ color: overTarget ? color : undefined }}>
            ({displayPercent}%)
          </span>
        </span>
      </div>
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* JEDEC target marker at 100% */}
        <div
          className="absolute top-0 bottom-0 w-px bg-gray-500 z-10"
          style={{ left: `${Math.min(100, (100 / Math.max(percentage, 100)) * 100)}%` }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
