// Gemini Pro API 래퍼
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// JSON 파싱 헬퍼
function parseJsonResponse(text: string): any {
  const cleaned = text.replace(/```json|```/g, "").trim();
  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from surrounding text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse JSON: ${cleaned.slice(0, 200)}`);
  }
}

// 뉴스 요약 + 수치 추출 (Flash)
export async function summarizeNews(article: string, citations: string[] = [], source?: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const isGlobal = source === "global";
  const result = await model.generateContent(`
    반도체 기술 기자로서 다음 기사를 분석하세요.
    ${isGlobal ? "(해외 뉴스입니다. 제목과 요약은 반드시 한국어로 번역하세요.)" : ""}

    기사: ${article}
    ${citations.length > 0 ? `\n출처 URL: ${citations.join(", ")}` : ""}

    JSON으로만 응답하세요 (마크다운 없이):
    {
      "title": "뉴스 제목 (한국어, 25자 이내)",
      "summary": "일반인용 3줄 요약 (전문용어엔 괄호설명, 한국어)",
      "category": "hbm|foundry|memory|packaging|market|ai-chip|process|other",
      "importance": "breaking|major|normal",
      "company": "samsung|hynix|tsmc|intel|micron|nvidia|both|industry",
      "date": "${new Date().toISOString().split("T")[0]}",
      "sourceUrl": "가장 관련 있는 출처 URL 하나 (없으면 null)",
      "sourceName": "언론사/매체명 (예: Reuters, 한국경제, IEEE Spectrum 등)",
      "region": "${isGlobal ? "global" : "kr"}",
      "metricsUpdates": [
        { "product": "HBM4|DDR5|GDDR7|LPDDR6|NAND", "company": "samsung|hynix", "field": "pinSpeed|bandwidth|capacity|powerEfficiency|actualAchieved", "value": "수치 문자열" }
      ]
    }
  `);
  return parseJsonResponse(result.response.text());
}

// 트렌드 → 학습방향 생성 (Pro)
export async function generateTrendBrief(trendData: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const result = await model.generateContent(`
    반도체 양산기술 면접 코치로서 다음 트렌드를 분석하세요.

    트렌드 데이터: ${trendData}

    JSON으로만 응답하세요 (마크다운 없이):
    {
      "title": "제목 (한국어)",
      "summary": "3줄 요약",
      "whyImportant": "왜 중요한지 (일상 연결)",
      "howToStudy": "공부 방법 + 참고자료 추천",
      "interviewTip": "★ 면접에서 이렇게 답하세요",
      "relatedTopics": ["mosfet-evolution", "high-k-metal-gate", "etch" 등 관련 토픽 slug],
      "difficulty": "beginner|intermediate|advanced",
      "sources": ["출처 URL 목록"]
    }
  `);
  return parseJsonResponse(result.response.text());
}

// 논문 → 학습 브리프 생성 (Pro)
export async function generatePaperBrief(paperData: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const result = await model.generateContent(`
    반도체 양산기술 면접 코치로서 다음 최신 논문/연구를 분석하세요.

    논문 데이터: ${paperData}

    JSON으로만 응답하세요 (마크다운 없이):
    {
      "title": "논문 주제 요약 제목 (한국어)",
      "summary": "핵심 발견 3줄 요약 (한국어, 비전공자도 이해 가능하게)",
      "whyImportant": "이 연구가 반도체 양산에 왜 중요한지 (실무 연결)",
      "howToStudy": "이 분야 공부 방법 + 관련 기초 개념 + 참고자료",
      "interviewTip": "★ 면접에서 이렇게 답하세요 (논문 인용하며 최신 동향 어필)",
      "papers": [
        { "title": "논문 원제 (영어)", "authors": "저자", "venue": "학회/저널명", "url": "논문 URL" }
      ],
      "relatedTopics": ["mosfet-evolution", "high-k-metal-gate", "etch" 등 관련 토픽 slug],
      "difficulty": "beginner|intermediate|advanced",
      "sources": ["출처 URL 목록"]
    }
  `);
  return parseJsonResponse(result.response.text());
}

// AI 면접 코치 — chatWithCoach는 /api/chat/route.ts에서 직접 처리
