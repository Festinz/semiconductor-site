"use client";

import { useState, useEffect } from "react";
import NewsListPage from "@/components/NewsListPage";
import staticNews from "@/data/news.json";

export default function HynixNewsPage() {
  const [news, setNews] = useState<any[]>(staticNews as any[]);

  useEffect(() => {
    fetch("/api/data/news")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setNews(data); })
      .catch(() => {});
  }, []);

  return <NewsListPage company="hynix" allNews={news} />;
}
