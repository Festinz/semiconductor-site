export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
당신은 SK하이닉스/삼성전자 양산 기술 면접관 출신 선배입니다.
후배에게 면접 준비를 도와주는 역할입니다.

모드:
1. [면접 모드] - 질문을 던지고 답변을 평가
2. [트렌드 모드] - 최신 트렌드 설명 + 공부 방향 제시
3. [개념 모드] - 반도체 개념 질문에 면접 수준으로 답변

규칙:
- 한국어로 대화
- 답변 평가 시: 잘한 점 → 부족한 점 → 추가할 키워드 순서
- 트렌드 설명 시: 요약 → 왜 중요한지 → 어떻게 공부할지
- 면접 포인트는 반드시 "★" 표시
- 톤: 선배가 카페에서 알려주는 느낌. 편하지만 정확하게.

예시:
사용자: "High-K Metal Gate에 대해 설명해주세요"
코치: "좋은 질문이야. 이건 면접에서 자주 나오는데..."
→ High-K와 Metal Gate를 각각 나눠 설명
→ ★ 포인트: "반드시 둘을 분리해서 답해야 해"
→ 관련 트렌드: "최근 GAA 수율 이슈 때문에 더 중요해짐"
`.trim();

function loadRagContext(userMessage: string) {
  const dataDir = path.join(process.cwd(), "src/data");
  try {
    const ragRaw = readFileSync(path.join(dataDir, "rag-knowledge.json"), "utf-8");
    const ragChunks: any[] = JSON.parse(ragRaw);

    // Simple keyword matching to find relevant chunks
    const query = userMessage.toLowerCase();
    const scored = ragChunks.map((chunk) => {
      let score = 0;
      const keywords: string[] = chunk.keywords || [];
      for (const kw of keywords) {
        if (query.includes(kw.toLowerCase())) score += 2;
      }
      if (chunk.title && query.includes(chunk.title.toLowerCase())) score += 3;
      if (chunk.process && query.includes(chunk.process.toLowerCase())) score += 1;
      // Boost if topic words appear
      if (chunk.topic) {
        const topicWords = chunk.topic.toLowerCase().split(/[-\s]+/);
        for (const w of topicWords) {
          if (w.length > 2 && query.includes(w)) score += 1;
        }
      }
      return { chunk, score };
    });

    // Return top 3 relevant chunks
    const topChunks = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.chunk);

    if (topChunks.length === 0) return "";

    return topChunks
      .map((c: any) => {
        let text = `[${c.title}]\n${c.content}`;
        if (c.interviewPoints?.length) {
          text += `\n면접 포인트:\n${c.interviewPoints.map((p: string) => `- ${p}`).join("\n")}`;
        }
        return text;
      })
      .join("\n\n---\n\n");
  } catch {
    return "";
  }
}

function loadContext(userMessage: string) {
  const dataDir = path.join(process.cwd(), "src/data");
  try {
    const metrics = readFileSync(path.join(dataDir, "metrics.json"), "utf-8");
    const trends = readFileSync(path.join(dataDir, "trends.json"), "utf-8");
    const fundamentals = readFileSync(path.join(dataDir, "fundamentals.json"), "utf-8");
    const trendsParsed = JSON.parse(trends);
    const trendsSummary = trendsParsed.length > 0
      ? trendsParsed.slice(0, 5).map((t: any) => `${t.title || ""}: ${t.summary || ""}`).join("\n")
      : "아직 트렌드 데이터 없음";

    const ragContext = loadRagContext(userMessage);
    const ragSection = ragContext
      ? `\n[RAG 참고자료 — SK하이닉스 5대 공정 교재 기반]\n${ragContext}`
      : "";

    return `
[최신 지표] ${metrics}
[최신 트렌드 (최근 5건)] ${trendsSummary}
[기본 개념] ${fundamentals}${ragSection}
    `.trim();
  } catch {
    return "[데이터 로드 실패 — 기본 지식으로 답변]";
  }
}

export async function POST(req: Request) {
  try {
    const { messages, mode } = await req.json();

    const lastMessage = messages[messages.length - 1].content;
    const context = loadContext(lastMessage);

    const modeInstruction = mode === "interview"
      ? "\n\n현재 [면접 모드]입니다. 면접 질문을 던지고 답변을 평가해주세요."
      : mode === "trend"
        ? "\n\n현재 [트렌드 모드]입니다. 최신 트렌드를 설명하고 공부 방향을 제시해주세요."
        : "\n\n현재 [개념 모드]입니다. 반도체 개념을 면접 수준으로 설명해주세요.";

    const systemInstruction = `${SYSTEM_PROMPT}${modeInstruction}\n\n참고 데이터:\n${context}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: { role: "user", parts: [{ text: systemInstruction }] },
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    // Streaming response
    const streamResult = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message || "스트리밍 오류" })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "채팅 처리 중 오류 발생" },
      { status: 500 }
    );
  }
}
