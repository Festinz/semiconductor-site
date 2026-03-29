"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HighKCompareSlider from "@/components/HighKCompareSlider";
import fundamentalsData from "@/data/fundamentals.json";

const data = fundamentalsData.topics.find((t) => t.id === "high-k-metal-gate") as any;

export default function HighKMetalGatePage() {
  return (
    <main className="min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/fundamentals" className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-green-500">{data.title}</h1>
            <p className="text-xs text-gray-500">{data.subtitle}</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Analogy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">🏠</span>
            <div>
              <h2 className="text-base font-semibold text-gray-200 mb-1">쉽게 말하면...</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{data.analogy}</p>
            </div>
          </div>
        </motion.div>

        {/* Two components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="rounded-2xl border border-amber-500/15 bg-amber-950/5 p-4 mb-6 text-xs text-amber-400/90 font-medium text-center">
            ★★★ 반드시 High-K와 Metal Gate를 분리해서 답할 것! 둘은 다른 문제를 해결하는 다른 기술
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.twoComponents.map((comp: any, i: number) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-blue-500" : "bg-purple-500"}`} />
                  <h3 className="text-sm font-bold text-gray-200">{comp.name}</h3>
                </div>

                <div className="space-y-3 flex-1 text-xs">
                  <div className="rounded-lg bg-red-950/10 border border-red-500/10 p-3">
                    <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1 font-medium">문제</p>
                    <p className="text-gray-400">{comp.problem}</p>
                  </div>
                  <div className="rounded-lg bg-green-950/10 border border-green-500/10 p-3">
                    <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1 font-medium">솔루션</p>
                    <p className="text-gray-400">{comp.solution}</p>
                  </div>
                  <div className="rounded-lg bg-blue-950/10 border border-blue-500/10 p-3">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 font-medium">효과</p>
                    <p className="text-gray-400">{comp.benefit}</p>
                  </div>
                  {comp.formula && (
                    <div className="rounded-lg bg-gray-800/40 p-3 font-mono text-gray-300 text-[11px]">
                      {comp.formula}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Samsung application */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-blue-400">삼성전자 적용 사례</span>
          </div>
          <p className="text-sm text-gray-300">{data.samsungApplication.milestone}</p>
          <p className="text-xs text-gray-500 mt-1">{data.samsungApplication.effect}</p>
          <p className="text-[10px] text-gray-600 mt-2">증착 방법: {data.depositionMethod}</p>
        </motion.div>

        {/* Interactive slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-base font-semibold mb-4">인터랙티브 비교</h2>
          <HighKCompareSlider />
        </motion.div>

        {/* Model interview answer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-6"
        >
          <h2 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <span>★</span> 면접 모범 답변 예시
          </h2>
          <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-5 text-sm text-gray-300 leading-relaxed space-y-3">
            <p className="text-gray-500 text-xs italic mb-2">Q: &ldquo;High-K Metal Gate에 대해 설명해주세요&rdquo;</p>
            <p>
              <span className="text-amber-400 font-semibold">High-K와 Metal Gate는 각각 다른 문제를 해결하는 별개의 기술입니다.</span>
            </p>
            <p>
              먼저 <span className="text-blue-400 font-medium">High-K 유전체</span>는 게이트 산화막의 터널링 누설전류 문제를 해결합니다.
              기존 SiO₂(유전율 3.9)는 미세화 시 두께가 2nm 이하로 얇아져 양자역학적 터널링이 급증합니다.
              이를 HfO₂(유전율 ~20)로 교체하면, 물리적으로는 두꺼운 막을 유지하면서 전기적으로는 얇은 막과 동일한 채널 구동력을 확보할 수 있습니다.
              EOT = t_physical × (3.9/k) 공식으로 등가 두께를 계산합니다.
            </p>
            <p>
              다음으로 <span className="text-purple-400 font-medium">Metal Gate</span>는 Poly-Si 게이트의 공핍층(Depletion) 문제를 해결합니다.
              Poly-Si에서는 게이트-산화막 계면에 공핍층이 형성되어 실질 산화막 두께가 증가하고 성능이 저하됩니다.
              TiN, TaN 등 금속으로 교체하면 공핍층 문제가 완전히 해결되고, Work Function도 정밀하게 조절할 수 있습니다.
            </p>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-800/50">
              실제 적용: 삼성전자가 DDR5에 세계 최초로 High-K Metal Gate를 적용하여 고속(8.4+ Gbps)에서의 안정적 동작을 실현했습니다.
              증착에는 ALD(원자층 증착)를 사용합니다 — 원자 단위 두께 제어가 필수이기 때문입니다.
            </p>
          </div>
        </motion.div>

        {/* Interview points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-green-500/15 bg-green-950/10 p-6"
        >
          <h2 className="text-base font-semibold text-green-400 mb-4 flex items-center gap-2">
            <span>★</span> 면접 포인트
          </h2>
          <div className="space-y-2.5">
            {data.interviewPoints.map((point: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-green-500/60 mt-0.5 flex-shrink-0">•</span>
                {point}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
