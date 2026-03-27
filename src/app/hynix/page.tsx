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
  { step: 4, title: "식각 (Etching)", analogy: "조각가가 불필요한 부분을 깎아내는 것", description: "SK하이닉스의 극저온 식각 기술로 3배 빠르고 화학 가스 90% 절감." },
  { step: 5, title: "증착 & 이온주입", analogy: "박막 코팅 + 전기 성질 부여 주사", description: "웨이퍼 위에 초박막 물질을 입히고, 이온을 주입해 전기적 특성을 부여합니다." },
  { step: 6, title: "금속 배선", analogy: "도시의 전력망 깔기", description: "트랜지스터들을 연결하는 구리 배선을 여러 층으로 쌓아 신호를 전달합니다." },
  { step: 7, title: "EDS (전기적 검사)", analogy: "공장 출하 전 품질 검사", description: "완성된 칩의 전기적 특성을 검사하여 양품과 불량을 판별합니다." },
  { step: 8, title: "패키징", analogy: "칩을 택배 포장하기", description: "TSV로 수직 관통 연결, MR-MUF로 접합. HBM의 핵심 기술이 집약된 단계." },
];

const techHighlights = [
  {
    title: "HBM4",
    subtitle: "메모리 · 글로벌 1위",
    description: "메모리를 층층이 쌓은 아파트인데, 세계에서 가장 높은 빌딩을 짓는 회사. 2013년 세계 최초 개발부터 현재까지 부동의 1위, 시장 점유율 70% 전망.",
    stats: [
      { label: "전송 속도", value: "11.7Gbps" },
      { label: "시장 점유율", value: "~70%" },
      { label: "HBM4 12단 가격", value: "$500" },
      { label: "HBM 시장", value: "$546억" },
    ],
  },
  {
    title: "LPDDR6",
    subtitle: "모바일 메모리 · 2026 발표",
    description: "자동차 기어처럼 상황에 맞게 속도와 전력 조절. DVFS 기술로 게이밍 시 최대 성능, 일반 사용 시 전력 20% 이상 절감하여 배터리 수명 연장.",
    stats: [
      { label: "속도 향상", value: "33%↑" },
      { label: "전력 절감", value: "20%↓" },
      { label: "핵심 기술", value: "DVFS" },
      { label: "공정", value: "1c 10nm" },
    ],
  },
  {
    title: "미래 기술 3대 트렌드",
    subtitle: "R&D · 차세대",
    description: "실리콘 포토닉스(빛으로 데이터 전송), 극저온 식각(3배 빠르고 가스 90%↓), 유리 기판(HBM 발열 해결). 미래 반도체의 한계를 돌파하는 혁신.",
    stats: [
      { label: "극저온 식각", value: "3배 빠름" },
      { label: "가스 절감", value: "90%↓" },
      { label: "포토닉스", value: "광통신" },
      { label: "유리 기판", value: "발열↓" },
    ],
  },
];

const hbmTimeline = [
  { year: "2013", event: "HBM1 세계 최초 개발", detail: "JEDEC JESD235 표준 채택" },
  { year: "2016", event: "HBM2 양산", detail: "256GB/s, 8GB" },
  { year: "2018", event: "HBM2E 양산", detail: "460GB/s, 16GB" },
  { year: "2022", event: "HBM3 양산", detail: "819GB/s, 24GB — AI 시장 성장 견인" },
  { year: "2024", event: "HBM3E 12단 세계 최초", detail: "36GB, 수율 80% 육박" },
  { year: "2026", event: "HBM4 양산 돌입", detail: "이천 M16, 청주 M15X" },
];

const news = [
  {
    title: "SK하이닉스, HBM4 최종 샘플 엔비디아 납품",
    summary: "2026년 3월 엔비디아에 HBM4 최종 샘플 납품. Vera Rubin 플랫폼 공급 물량 약 70% 확보 전망 (UBS).",
    date: "2026-03-25",
    category: "HBM",
    importance: "breaking" as const,
  },
  {
    title: "LPDDR6 발표 — DVFS로 전력 20% 절감",
    summary: "1c 10나노급 6세대 D램 발표. 서브채널 구조와 DVFS 기술로 데이터 처리 속도 33% 향상, 전력 소비 20% 절감.",
    date: "2026-03-22",
    category: "메모리",
    importance: "major" as const,
  },
  {
    title: "2025년 영업이익 44.7조 원 전망 — 창사 이래 최대 경신",
    summary: "HBM 수요 폭증과 AI 메모리 시장 성장에 힘입어 2025년 영업이익이 44.7조 원에 달할 것으로 추정.",
    date: "2026-03-18",
    category: "시장",
    importance: "major" as const,
  },
];

export default function HynixPage() {
  return (
    <main className="min-h-screen bg-hynix-bg-dark text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-hynix-bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← 메인으로
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-hynix-primary rounded-full" />
            <span className="text-sm font-medium text-white">SK hynix</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#hbm" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">HBM</a>
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(228,0,43,0.12),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-hynix-primary/10 rounded-full blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-hynix-accent/10 rounded-full blur-[80px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
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
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-hynix-primary to-transparent" />
              <span className="text-hynix-accent text-sm font-medium tracking-widest uppercase">
                Full Stack AI Memory Creator
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95]">
              <span className="text-white">SK하이닉스</span>
              <br />
              <span className="bg-gradient-to-r from-hynix-primary to-hynix-accent gradient-text">
                HBM의 창시자
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-8">
              2013년 세계 최초 HBM 개발.
              <br />
              아무도 가보지 않은 길에서 증명한{" "}
              <strong className="text-white">AI 메모리 리더십</strong>.
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-6 md:gap-10 mb-10">
              {[
                { value: "1위", label: "HBM 글로벌 점유율" },
                { value: "44.7조", label: "2025 영업이익 (원)" },
                { value: "~70%", label: "HBM4 시장 점유율" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-hynix-accent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#hbm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 bg-hynix-primary hover:bg-hynix-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              HBM 스토리 보기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* HBM Timeline Section */}
      <section id="hbm" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-hynix-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-hynix-accent text-sm font-medium tracking-wider uppercase">
              HBM History
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              HBM — 세계 최초에서 부동의 1위까지
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              메모리를 층층이 쌓은 아파트, 세계에서 가장 높은 빌딩을 짓는 회사
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-hynix-primary/50 via-hynix-primary/20 to-transparent" />

            <div className="space-y-8 md:space-y-12">
              {hbmTimeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-hynix-primary rounded-full -translate-x-1.5 mt-2 ring-4 ring-hynix-bg-dark z-10" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-hynix-primary/30 transition-colors">
                      <div className="text-hynix-accent font-bold text-lg mb-1">
                        {item.year}
                      </div>
                      <h3 className="text-white font-semibold mb-1">{item.event}</h3>
                      <p className="text-sm text-gray-400">{item.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* HBM Key Tech */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                title: "TSV",
                subtitle: "Through Silicon Via",
                desc: "빌딩의 엘리베이터처럼, 메모리 층 사이를 수직으로 관통하는 데이터 통로",
              },
              {
                title: "MR-MUF",
                subtitle: "Mass Reflow Molded Underfill",
                desc: "SK하이닉스만의 독자 접합 기술. HBM 적층의 핵심 비밀병기",
              },
              {
                title: "TC Bonding",
                subtitle: "Thermal Compression",
                desc: "열과 압력으로 칩을 정밀하게 접합하는 기술. 한미반도체 전속 공급",
              },
            ].map((tech, i) => (
              <div
                key={tech.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-hynix-primary/30 transition-colors"
              >
                <div className="text-hynix-accent font-bold text-xl mb-1">
                  {tech.title}
                </div>
                <div className="text-gray-500 text-xs mb-3">{tech.subtitle}</div>
                <p className="text-sm text-gray-400">{tech.desc}</p>
              </div>
            ))}
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
            <span className="text-hynix-accent text-sm font-medium tracking-wider uppercase">
              Semiconductor Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              반도체 8대 공정
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              모래 알갱이에서 HBM이 되기까지,
              SK하이닉스의 최첨단 기술이 적용되는 8단계
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processes.map((process, i) => (
              <ProcessCard
                key={process.step}
                {...process}
                accentColor="#E4002B"
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 최신 기술 Section */}
      <section id="tech" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-hynix-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-hynix-accent text-sm font-medium tracking-wider uppercase">
              Latest Technology
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              2026 핵심 기술
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              풀 스택 AI 메모리 크리에이터로서의 비전을 실현하는 SK하이닉스의 기술력
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techHighlights.map((tech, i) => (
              <TechHighlight
                key={tech.title}
                {...tech}
                accentColor="#FF6B35"
                accentBg="rgba(228,0,43,0.2)"
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
              {["DDR5 DVFS", "CXL", "실리콘 포토닉스", "극저온 식각", "유리 기판", "HBM5 로드맵", "NAND 400단+"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs bg-white/5 text-gray-400 rounded-full border border-white/10 hover:border-hynix-primary/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Position */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-hynix-accent">메모리 슈퍼사이클</span> 2026
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              1990년대 호황기와 유사한 슈퍼사이클이 도래했다 (BofA)
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "$9,750억", label: "글로벌 반도체 시장", sub: "전년비 25%↑ (WSTS)" },
              { value: "$546억", label: "HBM 시장", sub: "전년비 58%↑ (BofA)" },
              { value: "D램 51%↑", label: "D램 성장률", sub: "ASP 33%↑ (BofA)" },
              { value: "NAND 45%↑", label: "NAND 성장률", sub: "ASP 26%↑ (BofA)" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-hynix-primary/30 transition-colors"
              >
                <div className="text-xl md:text-2xl font-bold text-hynix-accent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 뉴스 Section */}
      <section id="news" className="py-20 md:py-32 bg-gradient-to-b from-transparent via-hynix-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-hynix-accent text-sm font-medium tracking-wider uppercase">
              Latest News
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              최신 뉴스
            </h2>
            <p className="text-gray-400">
              SK하이닉스 반도체 관련 최신 소식
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((item, i) => (
              <NewsCard
                key={item.title}
                {...item}
                accentColor="#E4002B"
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Full Stack Vision */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              풀 스택 <span className="text-hynix-accent">AI 메모리</span> 비전
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              HBM + LPDDR + NAND + CXL을 아우르는 토탈 메모리 솔루션
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏗️", title: "HBM", desc: "AI 학습용 초고대역폭 메모리" },
              { icon: "📱", title: "LPDDR", desc: "온디바이스 AI용 저전력 메모리" },
              { icon: "💿", title: "NAND", desc: "대용량 AI 데이터 저장소" },
              { icon: "🔗", title: "CXL", desc: "메모리 풀 확장 인터커넥트" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-hynix-primary/30 transition-colors"
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
