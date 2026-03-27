"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProcessCard from "@/components/ProcessCard";
import TechHighlight from "@/components/TechHighlight";
import NewsCard from "@/components/NewsCard";

const processes = [
  { step: 1, title: "웨이퍼 제조", analogy: "모래에서 보석 원판 만들기", description: "초고순도 실리콘 잉곳을 얇게 슬라이싱하여 원판(웨이퍼)을 만드는 첫 단계입니다." },
  { step: 2, title: "산화", analogy: "철에 녹 스는 원리로 보호막 씌우기", description: "웨이퍼 표면에 얇은 산화막을 형성하여 절연층을 만들어 보호합니다." },
  { step: 3, title: "포토리소그래피", analogy: "빔프로젝터로 초정밀 회로 사진 인화", description: "EUV/DUV 빛을 이용해 나노미터 단위의 회로 패턴을 웨이퍼에 새깁니다." },
  { step: 4, title: "식각 (Etching)", analogy: "조각가가 불필요한 부분을 깎아내는 것", description: "빛으로 새긴 패턴을 따라 불필요한 물질을 제거하여 회로를 완성합니다." },
  { step: 5, title: "증착 & 이온주입", analogy: "박막 코팅 + 전기 성질 부여 주사", description: "웨이퍼 위에 초박막 물질을 입히고, 이온을 주입해 전기적 특성을 부여합니다." },
  { step: 6, title: "금속 배선", analogy: "도시의 전력망 깔기", description: "트랜지스터들을 연결하는 구리 배선을 여러 층으로 쌓아 신호를 전달합니다." },
  { step: 7, title: "EDS (전기적 검사)", analogy: "공장 출하 전 품질 검사", description: "완성된 칩의 전기적 특성을 검사하여 양품과 불량을 판별합니다." },
  { step: 8, title: "패키징", analogy: "칩을 택배 포장하기", description: "검사를 통과한 칩을 외부 충격에서 보호하고 외부와 연결하도록 포장합니다." },
];

const techHighlights = [
  {
    title: "HBM4 / HBM4E",
    subtitle: "메모리 · 2026 양산",
    description: "메모리 아파트를 16층으로 쌓되, 엘리베이터(TSV)를 더 빠르게. 1c D램 + 4나노 베이스 다이로 핀당 11.7Gbps 달성, JEDEC 표준 대비 46% 초과 달성.",
    stats: [
      { label: "핀 속도", value: "11.7Gbps" },
      { label: "HBM4E 대역폭", value: "4.0TB/s" },
      { label: "열 저항 개선", value: "20%↓" },
      { label: "HBM 매출 성장", value: "3배↑" },
    ],
  },
  {
    title: "2나노 GAA (MBCFET™)",
    subtitle: "파운드리 · 수율 60%+",
    description: "트랜지스터의 문(게이트)을 3면이 아닌 4면에서 감싸는 혁신적 구조. 반년 만에 수율 20%에서 60%로 3배 개선하여 TSMC N2에 근접.",
    stats: [
      { label: "수율", value: "60%+" },
      { label: "반년 개선폭", value: "3배" },
      { label: "공정 노드", value: "2nm" },
      { label: "vs TSMC N2", value: "근접" },
    ],
  },
  {
    title: "DDR5 High-K Metal Gate",
    subtitle: "메모리 · 세계 최초",
    description: "전기가 새지 않는 초정밀 수도꼭지. DDR5에 세계 최초로 High-K 금속 게이트를 적용하여 누설전류를 대폭 줄이고 전력 효율을 향상.",
    stats: [
      { label: "적용", value: "세계 최초" },
      { label: "누설전류", value: "대폭↓" },
      { label: "전력 효율", value: "향상" },
      { label: "GTC 인정", value: "2026" },
    ],
  },
];

const news = [
  {
    title: "삼성전자, HBM4E 실물 GTC 2026에서 세계 최초 공개",
    summary: "핀당 16Gbps, 4.0TB/s 대역폭 달성. 차세대 AI 가속기용 메모리 표준을 선도하며, 2026년 하반기 샘플 출하 계획.",
    date: "2026-03-26",
    category: "HBM",
    importance: "breaking" as const,
  },
  {
    title: "2나노 파운드리 수율 60% 돌파, TSMC 추격 가시화",
    summary: "삼성전자 2나노 GAA(MBCFET) 공정 수율이 60%를 넘어섰다. 반년 만에 20%에서 3배 개선된 수치로, TSMC N2(60~70%)에 근접.",
    date: "2026-03-24",
    category: "파운드리",
    importance: "major" as const,
  },
  {
    title: "삼성전자 시총 1,000조 원 돌파 — 한국 기업 최초",
    summary: "HBM4 양산 출하 본격화와 2나노 수율 개선 소식에 힘입어, 삼성전자 시가총액이 사상 최초로 1,000조 원을 넘어섰다.",
    date: "2026-03-20",
    category: "시장",
    importance: "breaking" as const,
  },
];

export default function SamsungPage() {
  return (
    <main className="min-h-screen bg-samsung-bg-dark text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-samsung-bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← 메인으로
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-samsung-primary rounded-full" />
            <span className="text-sm font-medium text-white">Samsung Semiconductor</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#process" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">8대 공정</a>
            <a href="#tech" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">최신 기술</a>
            <a href="#news" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">뉴스</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,40,160,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
          {/* Animated glow orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-samsung-primary/10 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-samsung-accent/10 rounded-full blur-[80px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-samsung-primary to-transparent" />
              <span className="text-samsung-accent text-sm font-medium tracking-widest uppercase">
                AI 시대의 심장
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95]">
              <span className="text-white">삼성</span>
              <br />
              <span className="bg-gradient-to-r from-samsung-primary to-samsung-accent gradient-text">
                반도체
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-8">
              메모리 + 로직 설계 + 파운드리 + 패키징까지.
              <br />
              세계 유일의 <strong className="text-white">IDM 토털 솔루션</strong>으로
              AI 시대를 열어갑니다.
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-10">
              {[
                { value: "1,000조+", label: "시가총액 (원)" },
                { value: "333.6조", label: "2025 매출 (원)" },
                { value: "HBM4", label: "양산 출하 중" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-samsung-accent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#process"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 bg-samsung-primary hover:bg-samsung-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              8대 공정 알아보기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* 8대 공정 Section */}
      <section id="process" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-samsung-accent text-sm font-medium tracking-wider uppercase">
              Semiconductor Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              반도체 8대 공정
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              모래 알갱이에서 시작해 AI 칩이 되기까지,
              나노미터 세계에서 벌어지는 8단계 여정
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processes.map((process, i) => (
              <ProcessCard
                key={process.step}
                {...process}
                accentColor="#1428A0"
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 최신 기술 Section */}
      <section id="tech" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-samsung-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-samsung-accent text-sm font-medium tracking-wider uppercase">
              Latest Technology
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              2026 핵심 기술
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              초격차 기술 리더십으로 AI 반도체 시대를 선도하는 삼성전자의 최신 기술
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techHighlights.map((tech, i) => (
              <TechHighlight
                key={tech.title}
                {...tech}
                accentColor="#00A0E9"
                accentBg="rgba(20,40,160,0.2)"
                delay={i * 0.1}
              />
            ))}
          </div>

          {/* Additional tech tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm mb-4">더 많은 기술들</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["GDDR7", "LPDDR6", "X-Cube 3D", "PM9E1 SSD", "포토 에지 디퓨전", "HBM4E", "Custom HBM"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs bg-white/5 text-gray-400 rounded-full border border-white/10 hover:border-samsung-primary/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 뉴스 Section */}
      <section id="news" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-samsung-accent text-sm font-medium tracking-wider uppercase">
              Latest News
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              최신 뉴스
            </h2>
            <p className="text-gray-400">
              삼성전자 반도체 관련 최신 소식
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((item, i) => (
              <NewsCard
                key={item.title}
                {...item}
                accentColor="#1428A0"
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* IDM 강점 Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-transparent via-samsung-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              왜 <span className="text-samsung-accent">삼성반도체</span>인가?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              세계 유일의 IDM — 반도체의 처음부터 끝까지 한 회사에서 다 하는 백화점
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "💾", title: "메모리", desc: "D램, NAND, HBM 글로벌 리더" },
              { icon: "⚙️", title: "로직 설계", desc: "시스템 LSI로 맞춤형 칩 설계" },
              { icon: "🏭", title: "파운드리", desc: "2나노 GAA 공정으로 위탁생산" },
              { icon: "📦", title: "패키징", desc: "X-Cube 3D 적층 선단 기술" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-samsung-primary/30 transition-colors"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">
            반도체 기술 해설 사이트 &middot; 2026년 3월 기준 &middot; 교육 목적
          </p>
          <p className="text-gray-700 text-xs mt-2">
            본 사이트는 공식 발표 자료를 기반으로 제작된 교육용 콘텐츠입니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
