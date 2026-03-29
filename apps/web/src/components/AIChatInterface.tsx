"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---- types ---- */

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Mode = "interview" | "trend" | "concept";

/* ---- constants ---- */

const MODES: { key: Mode; emoji: string; label: string; desc: string }[] = [
  { key: "interview", emoji: "🎯", label: "면접 모드", desc: "면접 질문을 던져주세요" },
  { key: "trend", emoji: "📰", label: "트렌드 모드", desc: "최신 트렌드 알려주세요" },
  { key: "concept", emoji: "📚", label: "개념 모드", desc: "개념을 설명해주세요" },
];

const SUGGESTED_QUESTIONS = [
  "High-K Metal Gate에 대해 설명해주세요",
  "HBM4와 HBM3E의 차이점은?",
  "GAA 수율 문제와 해결 방안은?",
  "DVFS 기술이 왜 중요한가요?",
  "최근 반도체 트렌드를 요약해주세요",
];

const MODE_STARTERS: Record<Mode, string> = {
  interview: "면접 질문 하나 내주세요!",
  trend: "최근 반도체 트렌드를 요약해주세요.",
  concept: "",
};

/* ---- component ---- */

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("concept");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);
      setStreamingText("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, mode }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) {
                fullText += `\n\n[오류: ${parsed.error}]`;
              } else if (parsed.text) {
                fullText += parsed.text;
                setStreamingText(fullText);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }

        setMessages([...newMessages, { role: "assistant", content: fullText || "응답을 받지 못했습니다." }]);
        setStreamingText("");
      } catch (err: any) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `API 연결 오류: ${err.message}\n\n.env.local에 GEMINI_API_KEY가 설정되어 있는지 확인해주세요.`,
          },
        ]);
        setStreamingText("");
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, loading, mode]
  );

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    const starter = MODE_STARTERS[newMode];
    if (starter && messages.length === 0) {
      sendMessage(starter);
    }
  }

  function handleReset() {
    setMessages([]);
    setStreamingText("");
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-gray-800/60 bg-gray-950/60 overflow-hidden flex-shrink-0 hidden md:block"
          >
            <div className="w-[280px] p-4 space-y-5 h-full overflow-y-auto">
              {/* Mode selector */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-medium">
                  코칭 모드
                </p>
                <div className="space-y-1.5">
                  {MODES.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => handleModeChange(m.key)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all ${
                        mode === m.key
                          ? "bg-green-500/10 border border-green-500/25 text-green-400"
                          : "bg-gray-900/30 border border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/40"
                      }`}
                    >
                      <span className="mr-2">{m.emoji}</span>
                      <span className="font-medium">{m.label}</span>
                      <p className="text-[10px] text-gray-600 mt-0.5 ml-6">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested questions */}
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-medium">
                  추천 질문
                </p>
                <div className="space-y-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 rounded-lg text-[11px] text-gray-400 bg-gray-900/30 hover:bg-gray-800/50 hover:text-green-400 transition-all disabled:opacity-40 leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="w-full px-3 py-2 rounded-lg text-[11px] text-gray-500 border border-gray-800 hover:border-red-500/30 hover:text-red-400 transition-all"
                >
                  대화 초기화
                </button>
              )}

              {/* Info */}
              <div className="text-[10px] text-gray-600 space-y-1 pt-2 border-t border-gray-800/40">
                <p>Gemini 2.5 Flash 기반</p>
                <p>RAG: metrics + trends + fundamentals</p>
                <p>시스템: 양산기술 면접관 선배 페르소나</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile mode bar + sidebar toggle */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800/40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-300 transition-colors hidden md:block"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex gap-1.5 overflow-x-auto flex-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => handleModeChange(m.key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  mode === m.key
                    ? "bg-green-500/15 border border-green-500/25 text-green-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="text-[10px] text-gray-600 hover:text-red-400 transition-colors whitespace-nowrap"
            >
              초기화
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            {/* Empty state */}
            {messages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <span className="text-6xl block mb-5">🎓</span>
                <h2 className="text-xl font-semibold text-gray-200 mb-2">
                  안녕! 면접 준비 도와줄게.
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  {mode === "interview"
                    ? "면접 질문을 던질 테니, 답변해봐. 피드백 줄게!"
                    : mode === "trend"
                      ? "최신 반도체 트렌드를 정리해줄게."
                      : "반도체 개념을 면접 수준으로 설명해줄게. 질문해봐!"}
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto md:hidden">
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-2 rounded-xl border border-gray-800 bg-gray-900/50 text-xs text-gray-400 hover:border-green-500/30 hover:text-green-400 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 ${
                    msg.role === "user"
                      ? "bg-green-600/15 border border-green-500/20 text-gray-200"
                      : "bg-gray-800/50 border border-gray-700/30 text-gray-300"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">🎓</span>
                      <span className="text-[10px] text-gray-500 font-medium">면접 코치</span>
                      <span className="text-[10px] text-gray-700 ml-1">
                        {mode === "interview" ? "면접 모드" : mode === "trend" ? "트렌드 모드" : "개념 모드"}
                      </span>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {/* Streaming bubble */}
            {loading && streamingText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] md:max-w-[75%] bg-gray-800/50 border border-gray-700/30 rounded-2xl px-5 py-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🎓</span>
                    <span className="text-[10px] text-gray-500 font-medium">면접 코치</span>
                    <motion.span
                      className="text-[10px] text-green-500"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      응답 중...
                    </motion.span>
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {streamingText}
                    <motion.span
                      className="inline-block w-1.5 h-4 bg-green-500/50 ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading dots (before streaming starts) */}
            {loading && !streamingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800/50 border border-gray-700/30 rounded-2xl px-5 py-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🎓</span>
                    <span className="text-[10px] text-gray-500 font-medium">면접 코치</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.div
                        key={d}
                        className="w-2 h-2 rounded-full bg-green-500/40"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-800/60 bg-gray-950/90 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="max-w-3xl mx-auto px-4 py-3 flex gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "interview"
                  ? "답변을 입력하세요..."
                  : mode === "trend"
                    ? "트렌드에 대해 질문하세요..."
                    : "반도체 질문을 입력하세요..."
              }
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-green-600/15 border border-green-500/25 text-green-400 text-sm font-medium hover:bg-green-600/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
