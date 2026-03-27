"use client";

import { motion } from "framer-motion";

interface ProcessCardProps {
  step: number;
  title: string;
  analogy: string;
  description: string;
  accentColor: string;
  delay?: number;
}

export default function ProcessCard({
  step,
  title,
  analogy,
  description,
  accentColor,
  delay = 0,
}: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:border-white/20 transition-all duration-300 hover:bg-white/[0.08]">
        <div
          className="text-4xl font-black mb-3 opacity-20"
          style={{ color: accentColor }}
        >
          {String(step).padStart(2, "0")}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-3 italic">&ldquo;{analogy}&rdquo;</p>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
