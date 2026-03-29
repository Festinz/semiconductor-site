"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const CARDS = [
  {
    emoji: "🔬",
    title: "MOSFET 변천사",
    subtitle: "Planar → FinFET → GAA/MBCFET",
    desc: "트랜지스터 게이트 구조의 진화: 1면 → 3면 → 4면으로 채널 제어력 강화",
    tip: "★ 반드시 1면→3면→4면 흐름을 그림으로 설명",
    href: "/fundamentals/mosfet-evolution",
    color: "#8b5cf6",
  },
  {
    emoji: "🧱",
    title: "High-K Metal Gate",
    subtitle: "누설전류 해결의 결정적 전환점",
    desc: "SiO₂→HfO₂, Poly-Si→TiN/TaN 교체로 터널링·공핍층 문제 해결",
    tip: "★★★ 반드시 둘을 분리해서 답할 것!",
    href: "/fundamentals/high-k-metal-gate",
    color: "#3b82f6",
  },
  {
    emoji: "⚙️",
    title: "5대 공정",
    subtitle: "Photo · Etch · Diffusion · Thin Film · CMP",
    desc: "반도체 제조의 핵심 5단계 공정 — 각각의 원리, 파라미터, 면접 포인트",
    tip: "★ PR 구성요소, Wet/Dry 식각, ALD Self-limitation",
    href: "/fundamentals/process/photo",
    color: "#16a34a",
  },
  {
    emoji: "💧",
    title: "누설전류와 솔루션",
    subtitle: "OFF여야 하는데 흐르는 전류 5가지",
    desc: "HCI · Gate Oxide Tunneling · DIBL · GIDL · Punch-through 각각의 원인과 해결책",
    tip: "★ 각 누설전류와 솔루션 1:1 매칭 필수",
    href: "/fundamentals/leakage-current",
    color: "#ef4444",
  },
  {
    emoji: "📊",
    title: "반도체 데이터 4종류 & SPC/FDC",
    subtitle: "계측 · 설비 · 소자 · 수율 데이터",
    desc: "통계적 공정 관리(SPC)와 설비 이상 감지(FDC) — 스마트팩토리의 핵심",
    tip: "★ SPC는 결과 기반, FDC는 원인 기반",
    href: "/fundamentals/spc-fdc",
    color: "#f59e0b",
  },
  {
    emoji: "📡",
    title: "최신 트렌드",
    subtitle: "자동 갱신 · 매주 월/목",
    desc: "Perplexity + Gemini가 수집하는 HBM, GAA, EUV, 3D DRAM 등 최신 논문/뉴스",
    tip: "왜 중요한지 · 공부 방법 · 면접 팁 자동 생성",
    href: "/fundamentals/trends",
    color: "#10b981",
  },
  {
    emoji: "🤖",
    title: "AI 면접 코치",
    subtitle: "Gemini 2.5 Flash 기반",
    desc: "SK하이닉스 · 삼성전자 양산기술 면접관 출신 선배가 면접 준비를 도와줍니다",
    tip: "면접 모드 · 트렌드 모드 · 개념 모드",
    href: "/fundamentals/ai-coach",
    color: "#22c55e",
  },
];

export default function FundamentalsPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-green-500">반도체 상식</h1>
            <p className="text-xs text-gray-500">MOSFET · 5대 공정 · 트렌드 · AI 면접 코치</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 7-card grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {CARDS.map((card) => (
            <motion.div key={card.title} variants={item}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 hover:border-gray-700 transition-all cursor-pointer h-full flex flex-col"
                  style={{ ["--card-color" as any]: card.color }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{card.emoji}</span>
                    <div
                      className="w-1 h-8 rounded-full opacity-60"
                      style={{ backgroundColor: card.color }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-200">{card.title}</h3>
                      <p className="text-[10px] text-gray-500">{card.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-4">
                    {card.desc}
                  </p>

                  <div
                    className="rounded-lg px-3 py-2 text-[10px] font-medium leading-snug"
                    style={{
                      backgroundColor: `${card.color}10`,
                      color: card.color,
                      border: `1px solid ${card.color}25`,
                    }}
                  >
                    {card.tip}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
                    자세히 보기
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}
