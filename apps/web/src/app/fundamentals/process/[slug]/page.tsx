"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import processesData from "@/data/processes.json";
import PhotoPRToggle from "@/components/PhotoPRToggle";
import EtchCompareAnimation from "@/components/EtchCompareAnimation";

const EMOJIS: Record<string, string> = {
  photo: "📸", etch: "🪨", diffusion: "💉", "thin-film": "🎨", cmp: "💅",
};

export default function ProcessPage({ params }: { params: { slug: string } }) {
  const process = (processesData.processes as any[]).find((p) => p.slug === params.slug);
  if (!process) return notFound();

  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Build accordion sections from process data
  const sections: { title: string; content: string }[] = [];

  if (process.keyMaterials) {
    sections.push({
      title: "핵심 재료",
      content: process.keyMaterials.map((m: any) => {
        let text = `${m.name}`;
        if (m.composition) text += `\n  구성: ${m.composition}`;
        if (m.description) text += `\n  ${m.description}`;
        if (m.types) text += "\n  " + m.types.map((t: any) => `• ${t.name}: ${t.behavior}`).join("\n  ");
        return text;
      }).join("\n\n"),
    });
  }
  if (process.types) {
    sections.push({
      title: "식각 방법",
      content: process.types.map((t: any) =>
        `${t.name}\n  ${t.description}\n  장점: ${t.pros || "-"}\n  단점: ${t.cons || "-"}\n  용도: ${t.useCase || "-"}`
      ).join("\n\n"),
    });
  }
  if (process.methods) {
    sections.push({
      title: "방법 비교",
      content: process.methods.map((m: any) => {
        let text = `${m.name}${m.subtype ? ` (${m.subtype})` : ""}`;
        text += `\n  ${m.description}`;
        text += `\n  장점: ${m.pros || "-"}`;
        text += `\n  단점: ${m.cons || "-"}`;
        if (m.useCase) text += `\n  용도: ${m.useCase}`;
        if (m.selfLimitation) text += `\n  Self-limitation: ${m.selfLimitation}`;
        if (m.subTypes) text += "\n  " + m.subTypes.map((s: any) => `• ${s.name}: ${s.description}`).join("\n  ");
        return text;
      }).join("\n\n"),
    });
  }
  if (process.annealingProcess) {
    const a = process.annealingProcess;
    sections.push({
      title: `${a.name}`,
      content: `목적: ${a.purpose}\n\n` +
        a.types.map((t: any) => `${t.name}: ${t.temp}, ${t.time}`).join("\n"),
    });
  }
  if (process.dopants) {
    sections.push({
      title: "도펀트 종류",
      content: process.dopants.map((d: any) =>
        `${d.type}: ${d.elements.join(", ")} → ${d.carriers} 전도`
      ).join("\n"),
    });
  }
  if (process.lightSources) {
    sections.push({
      title: "광원 세대",
      content: process.lightSources.map((l: any) =>
        `${l.name}: ${l.wavelength} (${l.era})`
      ).join("\n"),
    });
  }
  if (process.mechanism) {
    sections.push({
      title: "CMP 메커니즘",
      content: `화학적: ${process.mechanism.chemical}\n기계적: ${process.mechanism.mechanical}\n시너지: ${process.mechanism.synergy}`,
    });
  }
  if (process.materials) {
    sections.push({
      title: "CMP 재료",
      content: process.materials.map((m: any) => `${m.name}: ${m.description}`).join("\n\n"),
    });
  }
  if (process.postCMP) {
    sections.push({
      title: "Post-CMP 세정",
      content: `${process.postCMP.description}\n방법: ${process.postCMP.method}`,
    });
  }
  if (process.futureTech) {
    sections.push({
      title: `미래 기술: ${process.futureTech.name}`,
      content: `${process.futureTech.description}\n장점: ${process.futureTech.benefits?.join(", ") || "-"}\n주도: ${process.futureTech.company || "-"}`,
    });
  }

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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-500 text-sm font-bold flex items-center justify-center">
              {process.order}
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-500">{process.name}</h1>
              <p className="text-xs text-gray-500">{process.nameEn}</p>
            </div>
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
            <span className="text-4xl">{EMOJIS[process.slug] || "⚙️"}</span>
            <div>
              <h2 className="text-base font-semibold text-gray-200 mb-1">
                쉽게 말하면... {process.analogy.title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">{process.analogy.description}</p>
              <p className="text-xs text-gray-500 mt-2 italic">{process.analogy.everyday}</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="text-sm text-gray-300 leading-relaxed">{process.description}</p>
        </motion.div>

        {/* Interactive — slug-specific */}
        {process.slug === "photo" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <h2 className="text-base font-semibold mb-4">인터랙티브</h2>
            <PhotoPRToggle />
          </motion.div>
        )}
        {process.slug === "etch" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <h2 className="text-base font-semibold mb-4">인터랙티브</h2>
            <EtchCompareAnimation />
          </motion.div>
        )}

        {/* Key parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-base font-semibold mb-4">핵심 파라미터</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {process.keyParameters.map((p: any) => (
              <div key={p.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-200">{p.name}</span>
                  <span className="text-[10px] text-green-500/70 font-mono">{p.unit}</span>
                </div>
                <p className="text-xs text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accordion sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-base font-semibold mb-4">기술 상세</h2>
          <div className="space-y-2">
            {sections.map((section, i) => {
              const isOpen = openAccordion === i;
              return (
                <div key={i} className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-200">{section.title}</span>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Interview points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-green-500/15 bg-green-950/10 p-6"
        >
          <h2 className="text-base font-semibold text-green-400 mb-4 flex items-center gap-2">
            <span>★</span> 면접 포인트
          </h2>
          <div className="space-y-2.5">
            {process.interviewPoints.map((point: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-green-500/60 mt-0.5 flex-shrink-0">•</span>
                {point}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Process nav */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
          {process.order > 1 && (
            <Link
              href={`/fundamentals/process/${(processesData.processes as any[]).find((p: any) => p.order === process.order - 1)?.slug}`}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← 이전: {(processesData.processes as any[]).find((p: any) => p.order === process.order - 1)?.name}
            </Link>
          )}
          <div className="flex-1" />
          {process.order < 5 && (
            <Link
              href={`/fundamentals/process/${(processesData.processes as any[]).find((p: any) => p.order === process.order + 1)?.slug}`}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              다음: {(processesData.processes as any[]).find((p: any) => p.order === process.order + 1)?.name} →
            </Link>
          )}
        </div>

      </div>
    </main>
  );
}
