"use client";

import { motion } from "framer-motion";

interface NewsCardProps {
  title: string;
  summary: string;
  date: string;
  category: string;
  importance: "breaking" | "major" | "normal";
  accentColor: string;
  delay?: number;
}

const importanceBadge = {
  breaking: { label: "속보", bg: "bg-red-500/20", text: "text-red-400" },
  major: { label: "주요", bg: "bg-yellow-500/20", text: "text-yellow-400" },
  normal: { label: "일반", bg: "bg-gray-500/20", text: "text-gray-400" },
};

export default function NewsCard({
  title,
  summary,
  date,
  category,
  importance,
  accentColor,
  delay = 0,
}: NewsCardProps) {
  const badge = importanceBadge[importance];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.08]"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
        <span
          className="px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          {category}
        </span>
        <span className="text-xs text-gray-600 ml-auto">{date}</span>
      </div>
      <h4 className="text-white font-semibold mb-2 line-clamp-2">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
        {summary}
      </p>
    </motion.div>
  );
}
