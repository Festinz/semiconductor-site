"use client";

import dynamic from "next/dynamic";

const CompareDashboard = dynamic(
  () => import("@/components/CompareDashboard"),
  { ssr: false, loading: () => <div className="min-h-screen flex items-center justify-center"><p className="text-sm text-gray-500">비교 대시보드 로딩 중...</p></div> }
);

export default function HynixComparePage() {
  return <CompareDashboard company="hynix" />;
}
