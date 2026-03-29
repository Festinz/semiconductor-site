"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    title: "삼성전자",
    subtitle: "반도체",
    description: "초격차 IDM 토털 솔루션",
    href: "/samsung",
    color: "#1428A0",
    gradient: "from-blue-900/80 to-blue-950/90",
    borderColor: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400/60",
    glowColor: "hover:shadow-blue-500/20",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
        <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M20 28h24M20 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="36" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    stats: ["HBM4 세계 최초 양산", "2nm GAA 수율 60%+", "DDR5 High-K Metal Gate"],
  },
  {
    title: "SK하이닉스",
    subtitle: "반도체",
    description: "풀 스택 AI 메모리 크리에이터",
    href: "/hynix",
    color: "#E4002B",
    gradient: "from-red-900/80 to-red-950/90",
    borderColor: "border-red-500/30",
    hoverBorder: "hover:border-red-400/60",
    glowColor: "hover:shadow-red-500/20",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
        <path d="M16 48V16l16 16L48 16v32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    stats: ["HBM 점유율 ~70%", "GDDR7 48GB 세계 최초", "LPDDR6 DVFS 전력 20%↓"],
  },
  {
    title: "반도체 상식",
    subtitle: "& AI 면접 코치",
    description: "MOSFET · 5대 공정 · 트렌드",
    href: "/fundamentals",
    color: "#16A34A",
    gradient: "from-green-900/80 to-green-950/90",
    borderColor: "border-green-500/30",
    hoverBorder: "hover:border-green-400/60",
    glowColor: "hover:shadow-green-500/20",
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
        <path d="M32 12v8M20 16l4 6M44 16l-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="16" y="28" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M24 36h16M24 44h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    stats: ["MOSFET 변천사", "High-K Metal Gate", "AI 면접 코치"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          반도체 기술 허브
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          삼성 · SK하이닉스 반도체 기술 비교 및 학습 플랫폼
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
      >
        {sections.map((section) => (
          <motion.div key={section.href} variants={cardVariants}>
            <Link href={section.href} className="block h-full">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`
                  relative h-full rounded-2xl border bg-gradient-to-b p-8
                  ${section.gradient} ${section.borderColor} ${section.hoverBorder}
                  ${section.glowColor} hover:shadow-2xl
                  transition-shadow duration-300 cursor-pointer
                  flex flex-col
                `}
              >
                <div className="mb-6 opacity-70" style={{ color: section.color }}>
                  {section.icon}
                </div>

                <h2 className="text-2xl font-bold mb-1">{section.title}</h2>
                <p className="text-sm text-gray-400 mb-3">{section.subtitle}</p>
                <p className="text-sm text-gray-300 mb-6">{section.description}</p>

                <div className="mt-auto space-y-2">
                  {section.stats.map((stat) => (
                    <div
                      key={stat}
                      className="flex items-center gap-2 text-xs text-gray-400"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: section.color }}
                      />
                      {stat}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium" style={{ color: section.color }}>
                  입장하기
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

    </main>
  );
}
