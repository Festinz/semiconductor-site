// Perplexity Pro API 래퍼
const PERPLEXITY_API = "https://api.perplexity.ai/chat/completions";

export interface PerplexityResponse {
  choices?: { message?: { content?: string } }[];
  citations?: string[];
}

export async function searchWithPerplexity(
  query: string,
  model: "sonar" | "sonar-pro" = "sonar",
  options?: { recency?: "day" | "week" | "month"; systemPrompt?: string }
): Promise<PerplexityResponse> {
  const res = await fetch(PERPLEXITY_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model === "sonar-pro" ? "sonar-pro" : "sonar",
      messages: [
        {
          role: "system",
          content:
            options?.systemPrompt ||
            "반도체 기술 전문 리서처. 최신 논문/뉴스 기반. 출처 URL 필수 포함. 각 항목을 번호 매겨서 나열.",
        },
        { role: "user", content: query },
      ],
      return_citations: true,
      search_recency_filter: options?.recency || "week",
    }),
  });

  if (!res.ok) {
    throw new Error(`Perplexity API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── 뉴스 검색 (매일) ──────────────────────────────────

// 한국 뉴스 — 모든 언론사 대상
export async function fetchSemiNews(company: "samsung" | "hynix") {
  const companyName = company === "samsung" ? "삼성전자" : "SK하이닉스";
  const keywords = company === "samsung"
    ? "HBM DDR GDDR 파운드리 GAA EUV 3nm 2nm"
    : "HBM DDR GDDR LPDDR NAND MR-MUF 극저온식각";
  const query = `${companyName} 반도체 최신 뉴스 ${keywords} 2026.
다양한 언론사에서 검색해줘: 연합뉴스, 조선일보, 중앙일보, 동아일보, 한국경제, 매일경제, 전자신문, 디지털타임스, ZDNet Korea, The Elec, 테크월드, 뉴시스, 아시아경제, IT조선 등.
각 뉴스를 제목과 3줄 요약으로 나눠서 번호 매겨 최소 5개 이상 나열해줘. 출처 URL 필수.`;
  return searchWithPerplexity(query, "sonar");
}

// 해외 뉴스 — 글로벌 반도체 업계 동향
export async function fetchGlobalNews() {
  return searchWithPerplexity(
    `Latest semiconductor industry news 2026: Samsung, SK Hynix, TSMC, Intel, Micron, NVIDIA, AMD.
Topics: HBM, DDR5, GDDR7, advanced packaging, GAA, EUV High-NA, foundry, AI chips, DRAM, NAND.
Search across: Reuters, Bloomberg, TechCrunch, AnandTech, Tom's Hardware, SemiAnalysis, The Register, EE Times, Semiconductor Engineering, DigiTimes, SEMI, Nikkei Asia, WCCFTech.
List at least 5 news items numbered, each with title and 3-line summary. Include source URLs.`,
    "sonar",
    { systemPrompt: "Semiconductor industry research analyst. Provide factual news with source URLs. Number each item." }
  );
}

// ── 논문/리서치 검색 (주 2회, 트렌드와 함께) ──────────

// 최신 논문 검색 — arxiv, IEEE, Nature 등
export async function fetchLatestPapers(topic: string) {
  return searchWithPerplexity(
    `Find the most recent academic papers and research publications about: semiconductor ${topic} 2025 2026.
Search specifically on: arxiv.org, ieee.org, nature.com, science.org, acs.org, springer.com, iedm.org.
For each paper provide:
- Paper title (original)
- Authors (first author + et al.)
- Publication venue (journal/conference name)
- Key findings in 2-3 sentences
- Direct URL to the paper
List at least 3-5 papers, numbered.`,
    "sonar-pro",
    {
      recency: "month",
      systemPrompt: "Academic research specialist in semiconductor technology. Only cite real published papers with verifiable URLs. Be precise about publication details."
    }
  );
}

// 트렌드 딥리서치 (주 2회)
export async function fetchTrends(topic: string) {
  return searchWithPerplexity(
    `Semiconductor ${topic}: latest research breakthroughs, industry trends, and technology roadmap 2025-2026.
Search across: academic papers (IEEE, arxiv, Nature), industry reports (SEMI, IMEC, Yole), tech media (SemiAnalysis, EE Times, Semiconductor Engineering, AnandTech).
For each trend/finding provide: title, source, key details, and why it matters for mass production.
List at least 3-5 items numbered with source URLs.`,
    "sonar-pro",
    { recency: "month" }
  );
}
