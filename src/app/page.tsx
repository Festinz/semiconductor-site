"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 mb-16"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            반도체 기술 해설
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI 시대를 이끄는 반도체 핵심 기술을
            <br className="hidden sm:block" />
            누구나 쉽게 이해할 수 있도록
          </p>
        </motion.div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6 md:gap-10 relative z-10 w-full max-w-3xl px-4">
        {/* Samsung Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1"
        >
          <Link href="/samsung" className="block group">
            <div className="relative bg-gradient-to-br from-samsung-primary/20 to-samsung-dark/30 border border-samsung-primary/30 rounded-2xl p-8 md:p-10 transition-all duration-300 group-hover:border-samsung-primary/60 group-hover:shadow-[0_0_40px_rgba(20,40,160,0.3)] group-hover:scale-[1.02]">
              <div className="absolute top-4 right-4 w-3 h-3 bg-samsung-primary rounded-full animate-pulse" />
              <div className="text-samsung-accent text-sm font-medium mb-3 tracking-wider uppercase">
                Samsung Semiconductor
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                삼성전자
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                IDM 토털 솔루션으로 AI 시대의 초격차 기술 리더십
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["HBM4", "2nm GAA", "DDR5"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-samsung-primary/20 text-samsung-accent rounded-full border border-samsung-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-samsung-accent group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-medium">사이트 방문하기</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Hynix Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex-1"
        >
          <Link href="/hynix" className="block group">
            <div className="relative bg-gradient-to-br from-hynix-primary/20 to-hynix-dark/30 border border-hynix-primary/30 rounded-2xl p-8 md:p-10 transition-all duration-300 group-hover:border-hynix-primary/60 group-hover:shadow-[0_0_40px_rgba(228,0,43,0.3)] group-hover:scale-[1.02]">
              <div className="absolute top-4 right-4 w-3 h-3 bg-hynix-primary rounded-full animate-pulse" />
              <div className="text-hynix-accent text-sm font-medium mb-3 tracking-wider uppercase">
                SK hynix
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                SK하이닉스
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                세계 최초 HBM 개발사, 풀 스택 AI 메모리 크리에이터
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["HBM4", "LPDDR6", "DVFS"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-hynix-primary/20 text-hynix-accent rounded-full border border-hynix-primary/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-hynix-accent group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-medium">사이트 방문하기</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Bottom info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gray-600 text-sm mt-16 relative z-10"
      >
        반도체 8대 공정 &middot; 최신 기술 트렌드 &middot; 2026년 기준
      </motion.p>
    </main>
  );
}
