import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "반도체 기술 허브",
  description: "삼성 · SK하이닉스 반도체 기술 비교 및 학습 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
