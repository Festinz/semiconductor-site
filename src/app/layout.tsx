import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "반도체 기술 해설 - Samsung & SK hynix",
  description:
    "삼성전자와 SK하이닉스의 반도체 8대 공정과 최신 기술 트렌드를 쉽게 이해할 수 있는 인터랙티브 사이트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
