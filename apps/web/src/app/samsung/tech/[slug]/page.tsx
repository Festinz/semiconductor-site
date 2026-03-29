"use client";

import { notFound } from "next/navigation";
import TechDetailLayout from "@/components/TechDetailLayout";
import HBMStackViewer from "@/components/HBMStackViewer";
import HighKCompareSlider from "@/components/HighKCompareSlider";
import GDDR7DiagramViewer from "@/components/GDDR7DiagramViewer";
import DVFSSimulator from "@/components/DVFSSimulator";
import {
  getLineupKey,
  getLineup,
  getMetrics,
  getRelatedNews,
  buildSpecs,
  getJedec,
  getAnalogy,
  getDeepDive,
  getOneLiner,
} from "@/lib/tech-detail-data";

const INTERACTIVE_MAP: Record<string, React.ReactNode> = {
  HBM4: <HBMStackViewer />,
  DDR5: <HighKCompareSlider />,
  GDDR7: <GDDR7DiagramViewer />,
  LPDDR6: <DVFSSimulator />,
  NAND: (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center">
      <p className="text-sm text-gray-500">NAND 3D 적층 인터랙티브 — 준비 중</p>
    </div>
  ),
};

export default function SamsungTechPage({ params }: { params: { slug: string } }) {
  const key = getLineupKey(params.slug);
  if (!key) return notFound();

  const lineup = getLineup("samsung", key);
  if (!lineup) return notFound();

  const metrics = getMetrics(key);
  const metricsCompany = metrics?.samsung;
  const metricsCompetitor = metrics?.hynix;
  const jedecData = metrics?.jedec;

  return (
    <TechDetailLayout
      company="samsung"
      brandColor="#1428A0"
      competitorName="하이닉스"
      backHref="/samsung"
      name={lineup.name}
      fullName={lineup.fullName}
      oneLiner={getOneLiner(key, "samsung")}
      status={lineup.status}
      milestone={lineup.milestone || null}
      analogy={getAnalogy(key)}
      specs={buildSpecs(lineup, metricsCompany, metricsCompetitor)}
      jedec={getJedec(metricsCompany, jedecData)}
      deepDive={getDeepDive(key, "samsung", lineup)}
      interactive={INTERACTIVE_MAP[key] || <div />}
      relatedNews={getRelatedNews(key, "samsung")}
      sources={["삼성전자 반도체 뉴스룸", "JEDEC 표준 사양"]}
    />
  );
}
