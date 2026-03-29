# Skills 전체 정의 (v3 Final — Perplexity Pro + Gemini Pro)

## 10개 스킬 목록
1. research-semiconductor (Perplexity Sonar Pro → 딥리서치)
2. tech-simplifier (비유 생성)
3. interactive-component (인터랙티브 UI)
4. news-curator (Perplexity Sonar → 뉴스 검색 + Gemini Flash → 요약)
5. fact-checker (검증)
6. design-system (디자인)
7. deploy-automation (배포)
8. comparison-dashboard (양사 비교)
9. fundamentals-writer (반도체 상식)
10. metrics-updater (뉴스→지표 자동 갱신)

---

## 핵심 API 연동 코드

### lib/perplexity.ts
```typescript
// Perplexity Pro API 래퍼
const PERPLEXITY_API = "https://api.perplexity.ai/chat/completions";

export async function searchWithPerplexity(query: string, model: "sonar" | "sonar-pro" = "sonar") {
  const res = await fetch(PERPLEXITY_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model === "sonar-pro" ? "sonar-pro" : "sonar",
      messages: [
        { role: "system", content: "반도체 기술 전문 리서처. 최신 논문/뉴스 기반. 출처 URL 필수 포함." },
        { role: "user", content: query }
      ],
      return_citations: true,
      search_recency_filter: "week"  // 최근 1주일 우선
    })
  });
  return res.json();
}

// 뉴스 검색 (매일)
export async function fetchSemiNews(company: "samsung" | "hynix") {
  const query = company === "samsung"
    ? "삼성전자 반도체 최신 뉴스 HBM DDR GDDR 파운드리 오늘"
    : "SK하이닉스 반도체 최신 뉴스 HBM DDR GDDR LPDDR 오늘";
  return searchWithPerplexity(query, "sonar");
}

// 트렌드 딥리서치 (주 2회)
export async function fetchTrends(topic: string) {
  return searchWithPerplexity(
    `semiconductor ${topic} latest research paper trend 2026 site:ieee.org OR site:arxiv.org OR site:nature.com`,
    "sonar-pro"
  );
}
```

### lib/gemini.ts
```typescript
// Gemini Pro API 래퍼
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 뉴스 요약 + 수치 추출 (Flash)
export async function summarizeNews(article: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(`
    반도체 기술 기자로서 다음 기사를 분석하세요.

    기사: ${article}

    JSON으로만 응답:
    {
      "summary": "일반인용 3줄 요약 (전문용어엔 괄호설명)",
      "category": "hbm|foundry|memory|packaging|market|other",
      "importance": "breaking|major|normal",
      "company": "samsung|hynix|both|industry",
      "metricsUpdates": [
        { "product": "HBM4", "company": "samsung", "field": "pinSpeed", "value": "11.7 Gbps" }
      ]
    }
  `);
  return JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
}

// 트렌드 → 학습방향 생성 (Pro)
export async function generateTrendBrief(trendData: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const result = await model.generateContent(`
    반도체 양산기술 면접 코치로서 다음 트렌드를 분석하세요.

    트렌드 데이터: ${trendData}

    JSON으로만 응답:
    {
      "title": "제목",
      "summary": "3줄 요약",
      "whyImportant": "왜 중요한지 (일상 연결)",
      "howToStudy": "공부 방법 + 참고자료 추천",
      "interviewTip": "★ 면접에서 이렇게 답하세요",
      "relatedTopics": ["mosfet", "etch", "high-k"],
      "difficulty": "beginner|intermediate|advanced"
    }
  `);
  return JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
}

// AI 면접 코치 (Flash — 스트리밍)
export async function chatWithCoach(messages: {role: string, content: string}[], context: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    })),
    systemInstruction: `
      당신은 SK하이닉스/삼성전자 양산기술 면접관 출신 선배입니다.

      참고 데이터:
      ${context}

      모드:
      1. [면접] 질문 → 답변 평가 (잘한점 → 부족한점 → ★추가 키워드)
      2. [트렌드] 최신 동향 설명 + 공부 방향
      3. [개념] 반도체 개념을 면접 수준으로 설명

      규칙: 한국어, 선배 톤, ★면접포인트 필수 표시
    `
  });
  return chat.sendMessage(messages[messages.length - 1].content);
}
```

### api/cron/fetch-news/route.ts
```typescript
// Vercel Cron: 매일 09:00, 18:00 KST
import { fetchSemiNews } from "@/lib/perplexity";
import { summarizeNews } from "@/lib/gemini";
import { readFileSync, writeFileSync } from "fs";

export async function GET() {
  // 1. Perplexity로 뉴스 검색
  const samsungNews = await fetchSemiNews("samsung");
  const hynixNews = await fetchSemiNews("hynix");
  
  // 2. Gemini로 요약 + 수치 추출
  const allArticles = [...extractArticles(samsungNews), ...extractArticles(hynixNews)];
  const summaries = await Promise.all(allArticles.map(a => summarizeNews(a)));
  
  // 3. news.json 갱신 (기존 유지 + 새 것 추가)
  const existing = JSON.parse(readFileSync("src/data/news.json", "utf-8"));
  const updated = [...summaries.filter(s => !existing.find(e => e.title === s.title)), ...existing];
  writeFileSync("src/data/news.json", JSON.stringify(updated.slice(0, 100), null, 2));
  
  // 4. metrics.json 갱신
  const metricsUpdates = summaries.flatMap(s => s.metricsUpdates || []);
  if (metricsUpdates.length > 0) {
    const metrics = JSON.parse(readFileSync("src/data/metrics.json", "utf-8"));
    metricsUpdates.forEach(u => {
      if (metrics[u.product]?.[u.company]) {
        metrics[u.product][u.company][u.field] = u.value;
        metrics[u.product][u.company].lastUpdated = new Date().toISOString();
      }
    });
    writeFileSync("src/data/metrics.json", JSON.stringify(metrics, null, 2));
  }
  
  return Response.json({ ok: true, newsCount: summaries.length, metricsUpdates: metricsUpdates.length });
}
```

### api/cron/fetch-trends/route.ts
```typescript
// Vercel Cron: 매주 월/목 09:00 KST
import { fetchTrends } from "@/lib/perplexity";
import { generateTrendBrief } from "@/lib/gemini";

const TREND_TOPICS = [
  "HBM4 HBM5 packaging",
  "GAA MBCFET gate all around yield",
  "EUV High-NA lithography",
  "3D DRAM CMOS under array",
  "cryogenic etching semiconductor",
  "silicon photonics chip interconnect",
  "glass substrate advanced packaging",
  "GDDR7 GDDR8 GPU memory",
  "CXL memory pooling",
  "neuromorphic computing semiconductor"
];

export async function GET() {
  // 랜덤 3개 토픽 선택 (매번 다른 토픽)
  const topics = TREND_TOPICS.sort(() => Math.random() - 0.5).slice(0, 3);
  
  const briefs = [];
  for (const topic of topics) {
    const trendData = await fetchTrends(topic);
    const brief = await generateTrendBrief(JSON.stringify(trendData));
    briefs.push({ ...brief, fetchedAt: new Date().toISOString(), topic });
  }
  
  // trends.json에 append (기존 유지!)
  const existing = JSON.parse(readFileSync("src/data/trends.json", "utf-8"));
  const updated = [...briefs, ...existing]; // 최신이 위로
  writeFileSync("src/data/trends.json", JSON.stringify(updated, null, 2));
  
  return Response.json({ ok: true, newTrends: briefs.length });
}
```

### api/chat/route.ts
```typescript
// AI 면접 코치 API 엔드포인트
import { chatWithCoach } from "@/lib/gemini";
import { readFileSync } from "fs";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // RAG: 관련 콘텐츠 로드
  const metrics = readFileSync("src/data/metrics.json", "utf-8");
  const trends = readFileSync("src/data/trends.json", "utf-8");
  const fundamentals = readFileSync("src/data/fundamentals.json", "utf-8");
  
  const context = `
    [최신 지표] ${metrics}
    [최신 트렌드 (최근 5건)] ${JSON.parse(trends).slice(0, 5).map(t => t.title + ": " + t.summary).join("\n")}
    [기본 개념] ${fundamentals}
  `;
  
  const result = await chatWithCoach(messages, context);
  return Response.json({ reply: result.response.text() });
}
```

### vercel.json
```json
{
  "crons": [
    { "path": "/api/cron/fetch-news", "schedule": "0 0 * * *" },
    { "path": "/api/cron/fetch-news", "schedule": "0 9 * * *" },
    { "path": "/api/cron/fetch-trends", "schedule": "0 0 * * 1,4" }
  ]
}
```

---

## 반도체 상식 콘텐츠 (fundamentals-writer 스킬)

### MOSFET 변천사
- Planar(1면) → FinFET(3면) → GAA/MBCFET(4면, 층층이 아파트)
- 누설전류: HCI, Gate Oxide Tunneling, DIBL, GIDL, Punch-through
- 솔루션: LDD → Halo Doping → High-K Metal Gate → GAA

### High-K Metal Gate (★면접 핵심)
- High-K: SiO₂(3.9) → HfO₂/ZrO₂(15~25) → 채널 구동력↑, 옥사이드 두껍게 가능
- Metal Gate: Poly-Si → TiN/TaN → Depletion 해결
- ★ 반드시 둘을 분리해서 답해야 함!

### 5대 공정 (권순찬 정리본 기반)
- Photo: PR(Polymer+PAC+Solvent), Positive/Negative, Hard Mask
- Etch: Wet/Dry/RIE, Selectivity, 극저온식각
- Diffusion: Ion Implantation + Annealing
- Thin Film: PVD(Sputtering)/CVD(Step Coverage)/ALD(Self-limitation→High-K)
- CMP: 화학+기계 연마, DI Water 세정

### SPC/FDC
- 품질 지표 20~30개 → AI로 수백 개 확장 니즈 (현업 이슈)
- 데이터 4종: 계측/설비(FDC)/소자/수율
