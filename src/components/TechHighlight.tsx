"use client";

import { motion } from "framer-motion";

interface TechHighlightProps {
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  accentColor: string;
  accentBg: string;
  delay?: number;
}

export default function TechHighlight({
  title,
  subtitle,
  description,
  stats,
  accentColor,
  accentBg,
  delay = 0,
}: TechHighlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 h-full hover:border-white/20 transition-all duration-300 hover:bg-white/[0.08]">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{ backgroundColor: accentBg, color: accentColor }}
        >
          {subtitle}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-lg p-3">
              <div
                className="text-lg font-bold"
                style={{ color: accentColor }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
