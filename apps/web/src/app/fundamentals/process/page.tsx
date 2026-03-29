"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import processesData from "@/data/processes.json";

/* ──────────────────────────── types ──────────────────────────── */
interface SlideSection {
  id: string;
  processId: string;
  processName: string;
  processOrder: number;
  title: string;
  content: React.ReactNode;
  color: string;
}

/* ──────────────────────────── colors ──────────────────────────── */
const PROCESS_COLORS: Record<string, string> = {
  photo: "#8b5cf6",
  etch: "#ef4444",
  diffusion: "#3b82f6",
  "thin-film": "#f59e0b",
  cmp: "#10b981",
};

const PROCESS_ICONS: Record<string, string> = {
  photo: "📸",
  etch: "🪨",
  diffusion: "💉",
  "thin-film": "🎨",
  cmp: "💅",
};

/* ──────────────────────────── slide builder ──────────────────────────── */
function buildSlides(): SlideSection[] {
  const slides: SlideSection[] = [];
  const processes = processesData.processes as any[];

  // Intro slide
  slides.push({
    id: "intro",
    processId: "intro",
    processName: "개요",
    processOrder: 0,
    title: "반도체 5대 공정 변천사",
    color: "#6ee7b7",
    content: (
      <div className="space-y-6">
        <p className="text-gray-300 text-base leading-relaxed">
          반도체 제조는 실리콘 웨이퍼 위에 여러 층을 쌓아 올려 회로를 형성하는 과정입니다.
          단순히 균일한 층을 반복적으로 적층하는 것이 아니라, 불필요한 부분을 깎고 필요한 부분을
          덧 입히며 다양한 형태를 정밀하게 구현하는 복합적인 공정입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {processes.map((p: any) => (
            <div
              key={p.id}
              className="rounded-xl border bg-gray-900/60 p-4 text-center"
              style={{ borderColor: `${PROCESS_COLORS[p.slug]}40` }}
            >
              <span className="text-2xl">{PROCESS_ICONS[p.slug]}</span>
              <p className="text-sm font-semibold mt-2" style={{ color: PROCESS_COLORS[p.slug] }}>
                {p.name}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">{p.nameEn}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-950/10 p-4">
          <p className="text-xs text-green-400 font-semibold mb-2">공정 Flow와 데이터 4종류</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["계측 데이터 (CD, Defect, Overlay)", "설비 데이터 (FDC Parameter)", "소자 데이터 (Vth, I, Cap)", "수율 데이터 (양품률)"].map((d) => (
              <div key={d} className="rounded-lg bg-gray-800/50 p-2 text-[10px] text-gray-400 text-center">{d}</div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 italic">
          미세화될수록 공정 Step이 증가하고 데이터 관리가 더욱 중요해집니다.
          Bar/space 패턴 길이(nm) 같은 미세 치수는 수율과 직결됩니다.
        </p>
      </div>
    ),
  });

  // Per-process slides
  processes.forEach((proc: any) => {
    const color = PROCESS_COLORS[proc.slug];
    const icon = PROCESS_ICONS[proc.slug];

    // Slide 1: Overview + analogy
    slides.push({
      id: `${proc.slug}-overview`,
      processId: proc.slug,
      processName: proc.name,
      processOrder: proc.order,
      title: `${icon} ${proc.name} (${proc.nameEn})`,
      color,
      content: (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">쉽게 말하면... {proc.analogy.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{proc.analogy.description}</p>
            <p className="text-xs text-gray-500 mt-2 italic">{proc.analogy.everyday}</p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{proc.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {proc.keyParameters?.map((p: any) => (
              <div key={p.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-3">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-200">{p.name}</span>
                  <span className="text-[10px] font-mono" style={{ color }}>{p.unit}</span>
                </div>
                <p className="text-[11px] text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    });

    // Slide 2: Methods/Types detail
    if (proc.types || proc.methods || proc.lightSources) {
      slides.push({
        id: `${proc.slug}-methods`,
        processId: proc.slug,
        processName: proc.name,
        processOrder: proc.order,
        title: `${icon} ${proc.name} — 기술 변천사`,
        color,
        content: (
          <div className="space-y-4">
            {/* Etch types */}
            {proc.types && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>식각 방법 분류</h3>
                {proc.types.map((t: any) => (
                  <div key={t.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                    <h4 className="text-sm font-semibold text-gray-200 mb-1">{t.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{t.description}</p>
                    <div className="flex flex-wrap gap-4 text-[11px]">
                      {t.pros && <span className="text-green-400">장점: {t.pros}</span>}
                      {t.cons && <span className="text-red-400">단점: {t.cons}</span>}
                    </div>
                    {t.useCase && <p className="text-[10px] text-gray-500 mt-1">용도: {t.useCase}</p>}
                  </div>
                ))}
                {/* RIE detail box */}
                <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-2">RIE 작동 원리 (면접 필수)</h4>
                  <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside">
                    <li>반응성 기체(XeF₂) + 비활성 기체(Ar) 주입</li>
                    <li>챔버에 고주파(RF) 에너지 인가 → 플라즈마 → 전자(−), 양이온(+), 라디칼(·) 생성</li>
                    <li>전기장(바이어스)으로 양이온을 표면 방향으로 수직 가속 → 물리적 식각</li>
                    <li>충돌로 결합이 약해진 표면에 라디칼이 반응하여 화학적 식각을 가속</li>
                  </ol>
                  <p className="text-[10px] text-red-300 mt-2 font-semibold">
                    결론: 비등방성(이온충돌) + 높은 선택비(라디칼) + 빠른 식각 = 현대 반도체 식각 표준
                  </p>
                </div>
              </div>
            )}
            {/* Diffusion methods */}
            {proc.methods && proc.slug === "diffusion" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>확산 → 이온주입 변천사</h3>
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">왜 Diffusion에서 Ion Implantation으로 변경했나?</h4>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                    <li><strong>디퓨전의 한계:</strong> 등방성 문제로 정확한 프로파일(농도/깊이)이 나오지 않음</li>
                    <li><strong>이온 임플란테이션:</strong> 비등방성이라 정확한 위치에 정확한 깊이로 도핑 가능</li>
                    <li><strong>어닐링(Annealing):</strong> 이온 충돌로 발생한 격자 손상을 복구하고, 불순물을 격자 내 안정적 위치(Substitutional Site)로 이동시켜 활성화하는 열처리</li>
                  </ul>
                </div>
                {proc.methods.map((m: any) => (
                  <div key={m.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-200">{m.name}</h4>
                      {m.era && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.era === "현재 주력" ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-400"}`}>
                          {m.era}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{m.description}</p>
                    <div className="flex gap-4 text-[11px] mt-2">
                      <span className="text-green-400">장점: {m.pros}</span>
                      <span className="text-red-400">단점: {m.cons}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Thin Film methods */}
            {proc.methods && proc.slug === "thin-film" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>증착 방법 비교</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-gray-300">구분</th>
                        <th className="text-left p-2 text-gray-300">원리</th>
                        <th className="text-left p-2 text-gray-300">장점</th>
                        <th className="text-left p-2 text-gray-300">단점</th>
                        <th className="text-left p-2 text-gray-300">용도</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proc.methods.map((m: any) => (
                        <tr key={m.name} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="p-2 font-semibold text-gray-200">{m.name}</td>
                          <td className="p-2 text-gray-400">{m.description?.slice(0, 40)}...</td>
                          <td className="p-2 text-green-400">{m.pros}</td>
                          <td className="p-2 text-red-400">{m.cons}</td>
                          <td className="p-2 text-gray-400">{m.useCase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-4">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">ALD Self-limitation 원리</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    1차 소스(예: Al(CH₃)₃)를 공급하면 표면에 1개 층만 흡착 (Self-limitation).
                    Purge 후 2차 소스(예: H₂O)를 공급하면 치환 반응으로 원자층 1개 형성.
                    이를 반복하여 원하는 두께를 정밀 제어합니다.
                  </p>
                  <p className="text-[10px] text-yellow-300 mt-2">
                    2Al(CH₃)₃ + 3H₂O → Al₂O₃ + 6CH₄↑
                  </p>
                </div>
              </div>
            )}
            {/* Photo light sources */}
            {proc.lightSources && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>광원 세대 변천사</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
                  {proc.lightSources.map((l: any, i: number) => (
                    <div key={l.name} className="relative pl-10 pb-4">
                      <div
                        className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2"
                        style={{
                          borderColor: color,
                          backgroundColor: i === proc.lightSources.length - 1 ? color : "transparent",
                        }}
                      />
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-gray-200">{l.name}</span>
                        <span className="text-xs text-gray-500">{l.wavelength}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{l.era}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">High-NA EUV (최신)</h4>
                  <p className="text-xs text-gray-300">
                    기존 EUV(NA 0.33) 대비 40% 향상된 광학 기술(NA 0.55)로 1.7배 더 정밀한 회로 형성 가능,
                    2.9배 높은 집적도 구현. 장비: ASML 트윈스캔 EXE:5200B.
                    SK하이닉스는 2021년 10나노급 4세대(1anm) DRAM에 EUV 첫 도입.
                  </p>
                </div>
              </div>
            )}
          </div>
        ),
      });
    }

    // Slide 3: Annealing / Mechanism / Materials detail
    if (proc.annealingProcess || proc.mechanism) {
      slides.push({
        id: `${proc.slug}-detail`,
        processId: proc.slug,
        processName: proc.name,
        processOrder: proc.order,
        title: `${icon} ${proc.name} — 핵심 상세`,
        color,
        content: (
          <div className="space-y-4">
            {proc.annealingProcess && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>어닐링 (Annealing) 종류</h3>
                <p className="text-xs text-gray-400">{proc.annealingProcess.purpose}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {proc.annealingProcess.types.map((t: any) => (
                    <div key={t.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
                      <h4 className="text-sm font-semibold text-gray-200 mb-2">{t.name}</h4>
                      <p className="text-xs text-gray-400">온도: {t.temp}</p>
                      <p className="text-xs text-gray-400">시간: {t.time}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4">
                  <p className="text-xs text-blue-300 font-semibold">
                    ★ 면접 포인트: &ldquo;Annealing은 단순한 열처리가 아니라, 불순물 활성화와 결정 복구를 동시에 수행하는 핵심 공정입니다.&rdquo;
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    온도·시간이 과하면 불순물이 깊게 확산되어 Junction Depth 제어가 어려워지므로,
                    RTA(Rapid Thermal Annealing) 같은 짧은 시간 고온 공정으로 제어합니다.
                  </p>
                </div>
              </div>
            )}
            {proc.dopants && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>도펀트 종류</h3>
                <div className="grid grid-cols-2 gap-3">
                  {proc.dopants.map((d: any) => (
                    <div key={d.type} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                      <h4 className="text-sm font-semibold text-gray-200">{d.type}</h4>
                      <p className="text-xs text-gray-400">원소: {d.elements.join(", ")}</p>
                      <p className="text-xs text-gray-400">캐리어: {d.carriers}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {proc.mechanism && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold" style={{ color }}>CMP 메커니즘</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
                    <p className="text-xs font-semibold text-blue-400 mb-1">화학적</p>
                    <p className="text-[11px] text-gray-400">{proc.mechanism.chemical}</p>
                  </div>
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
                    <p className="text-xs font-semibold text-red-400 mb-1">기계적</p>
                    <p className="text-[11px] text-gray-400">{proc.mechanism.mechanical}</p>
                  </div>
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
                    <p className="text-xs font-semibold text-green-400 mb-1">시너지</p>
                    <p className="text-[11px] text-gray-400">{proc.mechanism.synergy}</p>
                  </div>
                </div>
                {proc.materials && (
                  <>
                    <h4 className="text-xs font-semibold text-gray-300 mt-2">CMP 재료</h4>
                    {proc.materials.map((m: any) => (
                      <div key={m.name} className="rounded-lg border border-gray-800 bg-gray-900/40 p-3">
                        <span className="text-xs font-semibold text-gray-200">{m.name}</span>
                        <p className="text-[11px] text-gray-400">{m.description}</p>
                      </div>
                    ))}
                  </>
                )}
                {proc.postCMP && (
                  <div className="rounded-xl border border-green-500/20 bg-green-950/10 p-4">
                    <h4 className="text-xs font-semibold text-green-400 mb-1">Post-CMP 세정</h4>
                    <p className="text-[11px] text-gray-300">{proc.postCMP.description}</p>
                    <p className="text-[10px] text-gray-500 mt-1">방법: {proc.postCMP.method}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ),
      });
    }

    // Slide: Interview Points
    slides.push({
      id: `${proc.slug}-interview`,
      processId: proc.slug,
      processName: proc.name,
      processOrder: proc.order,
      title: `${icon} ${proc.name} — 면접 포인트`,
      color,
      content: (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-gray-900/60 p-6" style={{ borderColor: `${color}30` }}>
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color }}>
              <span>★</span> 면접에서 반드시 알아야 할 포인트
            </h3>
            <div className="space-y-3">
              {proc.interviewPoints?.map((point: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold" style={{ backgroundColor: `${color}20`, color }}>
                    {i + 1}
                  </span>
                  <span>{point.replace(/^★\s*/, "")}</span>
                </div>
              ))}
            </div>
          </div>
          {proc.futureTech && (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">미래 기술: {proc.futureTech.name}</h4>
              <p className="text-xs text-gray-300">{proc.futureTech.description}</p>
              {proc.futureTech.benefits && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {proc.futureTech.benefits.map((b: string) => (
                    <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400">{b}</span>
                  ))}
                </div>
              )}
              {proc.futureTech.company && (
                <p className="text-[10px] text-gray-500 mt-2">주도: {proc.futureTech.company}</p>
              )}
            </div>
          )}
        </div>
      ),
    });
  });

  return slides;
}

/* ──────────────────────────── page component ──────────────────────────── */
export default function ProcessOverviewPage() {
  const slides = buildSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
      setSidebarOpen(false);
    },
    [currentSlide]
  );

  const goNext = useCallback(() => {
    if (currentSlide < slides.length - 1) goTo(currentSlide + 1);
  }, [currentSlide, slides.length, goTo]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) goTo(currentSlide - 1);
  }, [currentSlide, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  // Group slides by process for sidebar
  const processGroups: { name: string; icon: string; color: string; slides: { index: number; title: string }[] }[] = [];
  let lastProcessId = "";
  slides.forEach((s, i) => {
    if (s.processId !== lastProcessId) {
      processGroups.push({
        name: s.processName,
        icon: PROCESS_ICONS[s.processId] || "📋",
        color: s.color,
        slides: [],
      });
      lastProcessId = s.processId;
    }
    processGroups[processGroups.length - 1].slides.push({ index: i, title: s.title });
  });

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed md:relative z-40 h-full w-72 border-r border-gray-800/60 bg-gray-950/95 backdrop-blur-md flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-800/60">
          <Link href="/fundamentals" className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs">반도체 상식</span>
          </Link>
          <h2 className="text-sm font-bold text-green-400">⚙️ 5대 공정 변천사</h2>
          <p className="text-[10px] text-gray-500 mt-1">Photo · Etch · Diffusion · Thin Film · CMP</p>
        </div>

        {/* Progress */}
        <div className="px-4 py-2 border-b border-gray-800/40">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
            <span>{currentSlide + 1} / {slides.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-green-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* TOC */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {processGroups.map((group) => (
            <div key={group.name}>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <span>{group.icon}</span>
                <span>{group.name}</span>
              </div>
              {group.slides.map((s) => {
                const isActive = s.index === currentSlide;
                return (
                  <button
                    key={s.index}
                    onClick={() => goTo(s.index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-gray-800/60 text-gray-100 font-medium"
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                    }`}
                  >
                    {isActive && (
                      <div className="w-0.5 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                    )}
                    <span className="text-[10px] text-gray-600 font-mono w-5 flex-shrink-0">
                      {String(s.index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{s.title.replace(/^[^\s]+\s/, "")}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Keyboard hint */}
        <div className="hidden md:block p-3 border-t border-gray-800/40 text-[9px] text-gray-600 text-center">
          ← → 키보드로 이동 가능
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Main content ─── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-lg bg-gray-900/90 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Slide content area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-4xl mx-auto px-6 md:px-16 py-12 md:py-16"
            >
              {/* Slide title */}
              <div className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-bold text-gray-100 pb-3 border-b-2"
                  style={{ borderColor: slide.color }}
                >
                  {slide.title}
                </motion.h1>
              </div>

              {/* Slide body */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation bar */}
        <div className="border-t border-gray-800/60 bg-gray-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">
              {currentSlide > 0 ? slides[currentSlide - 1].title.replace(/^[^\s]+\s/, "").slice(0, 25) : ""}
            </span>
          </button>

          <div className="flex items-center gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentSlide ? "w-4 bg-green-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">
              {currentSlide < slides.length - 1 ? slides[currentSlide + 1].title.replace(/^[^\s]+\s/, "").slice(0, 25) : ""}
            </span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
