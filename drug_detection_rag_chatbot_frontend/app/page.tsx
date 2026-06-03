"use client";

import { useState, useEffect, useRef } from "react";
import MessageList from "./components/MessageList";
import type {
  ChatMessage,
  NormalResponse,
  ClarificationResponse,
} from "./types/chat";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingThreadId, setPendingThreadId] = useState<string | null>(null);
  const [pendingSpellingReply, setPendingSpellingReply] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBotResponse = (data: ClarificationResponse | NormalResponse) => {
    if ("thread_id" in data) {
      const clarification = data as ClarificationResponse;

      if (clarification.type === "clarification") {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "missing",
            message: clarification.message,
            threadId: clarification.thread_id,
          },
        ]);
        return;
      }

      if (clarification.type === "spelling") {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "clarification",
            message: clarification.message,
            threadId: clarification.thread_id,
            corrections: clarification.corrections,
          },
        ]);
        return;
      }

      if (clarification.type === "both") {
        setPendingThreadId(clarification.thread_id);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "clarification",
            message: clarification.message,
            threadId: clarification.thread_id,
            corrections: clarification.corrections,
          },
        ]);
        return;
      }
    }

    const normal = data as NormalResponse;
    setMessages((prev) => [
      ...prev,
      { role: "bot", type: "normal", data: normal },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_query: input }),
      });

      const data = await res.json();
      console.log("full response:", data);

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "error",
            content: `Error: ${data.detail || "Something went wrong."}`,
          },
        ]);
        return;
      }

      handleBotResponse(data);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "error",
          content: "Error connecting to server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClarificationSubmit = async (
    threadId: string,
    userInput: string,
  ) => {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    if (pendingThreadId === threadId) {
      setPendingSpellingReply(userInput);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "missing",
          message: "Please also provide the missing value.",
          threadId: threadId,
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyse/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, user_reply: userInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "error",
            content: `Error: ${data.detail || "Something went wrong."}`,
          },
        ]);
        return;
      }
      handleBotResponse(data);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "error",
          content: "Error connecting to server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMissingSubmit = async (threadId: string, userInput: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setLoading(true);

    const combinedReply = pendingSpellingReply
      ? `${pendingSpellingReply}, ${userInput}`
      : userInput;

    setPendingThreadId(null);
    setPendingSpellingReply(null);

    try {
      const res = await fetch(`${API_BASE}/analyse/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          user_reply: combinedReply,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            type: "error",
            content: `Error: ${data.detail || "Something went wrong."}`,
          },
        ]);
        return;
      }
      handleBotResponse(data);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "error",
          content: "Error connecting to server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="flex flex-col flex-1 min-h-0 overflow-hidden"
      style={{ background: "#f8fafb" }}
    >
      {/* Global styles */}
      <style jsx global>{`
        @keyframes pulse-dot {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .msg-appear {
          animation: fade-up 0.3s ease-out forwards;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes thinking-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Messages */}
      <MessageList
        messages={messages}
        loading={loading}
        onClarificationSubmit={handleClarificationSubmit}
        onMissingSubmit={handleMissingSubmit}
      />

      {/* Compose Box */}
      <div className="bg-white px-4 pt-2 pb-2 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl border transition-all duration-200 overflow-hidden"
            style={{
              borderColor: input.trim() ? "#99f6e4" : "#e2e8f0",
              background: "#f8fafc",
              boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 150) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about drug interactions..."
              disabled={loading}
              rows={1}
              className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
              style={{
                minHeight: "38px",
                maxHeight: "150px",
                overflow: "auto",
              }}
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400 font-medium select-none hidden sm:block">
                  You
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 font-medium select-none hidden sm:block">
                  Dr. Drug Rag v1.0
                </span>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background:
                      input.trim() && !loading
                        ? "linear-gradient(135deg, #0d9488, #14b8a6)"
                        : "#cbd5e1",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
