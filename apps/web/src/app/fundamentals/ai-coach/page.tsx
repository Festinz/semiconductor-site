"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AIChatInterface from "@/components/AIChatInterface";

export default function AICoachPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-full mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/fundamentals" className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xl">🎓</span>
            <div>
              <h1 className="text-base font-bold text-green-500">AI 면접 코치</h1>
              <p className="text-[10px] text-gray-500">
                SK하이닉스 · 삼성전자 양산기술 면접관 출신 선배 · Gemini 2.5 Flash
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Chat interface */}
      <AIChatInterface />
    </main>
  );
}
