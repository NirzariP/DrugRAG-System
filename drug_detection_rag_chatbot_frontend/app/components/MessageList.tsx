"use client";

import { useRef, useEffect, useState } from "react";
import type { ChatMessage } from "../types/chat";
import MessageBubble from "./Message_bubble";

type MessageListProps = {
  messages: ChatMessage[];
  loading: boolean;
  onClarificationSubmit?: (threadId: string, userInput: string) => void;
  onMissingSubmit?: (threadId: string, userInput: string) => void;
};

const EXAMPLE_QUESTIONS = [
  "Can I take ibuprofen with grapefruit juice?",
  "What about warfarin and St. John's Wort?",
  "Is it safe to combine metformin with green tea?",
  "Does turmeric interact with blood thinners?",
];

export default function MessageList({
  messages,
  loading,
  onClarificationSubmit,
  onMissingSubmit,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length > 0) return;
    const interval = setInterval(() => {
      setActiveSuggestion((prev) => (prev + 1) % EXAMPLE_QUESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto chat-scroll">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center px-6 pb-8">
          <div className="relative mb-6">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #f0fdfa, #ccfbf1)",
              }}
            >
              <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
                <path
                  d="M20 12 C20 12, 20 32, 20 36 C20 44, 28 48, 32 48 C36 48, 44 44, 44 36 L44 30"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M16 8 L20 12 L24 8"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle
                  cx="44"
                  cy="26"
                  r="6"
                  stroke="#0d9488"
                  strokeWidth="3"
                  fill="#ccfbf1"
                />
                <circle cx="44" cy="26" r="2.5" fill="#0d9488" />
                <rect
                  x="6"
                  y="44"
                  width="14"
                  height="7"
                  rx="3.5"
                  fill="#6366f1"
                  opacity="0.2"
                />
                <line
                  x1="13"
                  y1="44"
                  x2="13"
                  y2="51"
                  stroke="#6366f1"
                  strokeWidth="0.8"
                  opacity="0.3"
                />
                <rect
                  x="48"
                  y="48"
                  width="12"
                  height="6"
                  rx="3"
                  fill="#0d9488"
                  opacity="0.2"
                  transform="rotate(-30 54 51)"
                />
                <rect
                  x="50"
                  y="8"
                  width="2.5"
                  height="10"
                  rx="1.25"
                  fill="#0d9488"
                  opacity="0.25"
                />
                <rect
                  x="46.75"
                  y="11.75"
                  width="2.5"
                  height="10"
                  rx="1.25"
                  fill="#0d9488"
                  opacity="0.25"
                  transform="rotate(90 48 16.75)"
                />
              </svg>
            </div>
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-300 opacity-60"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-1 -left-2 w-2 h-2 rounded-full bg-indigo-300 opacity-50"
              style={{ animation: "pulse-dot 2s ease-in-out 0.6s infinite" }}
            />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-1.5 tracking-tight">
            Pharmacological Interaction Assistant
          </h2>

          <p className="text-sm text-slate-500 text-center max-w-md mb-8">
            Ask about drug-food, drug-herb, and drug-drug interactions. Get
            severity levels, mechanisms, and recommendations instantly.
          </p>

          <div className="w-full max-w-md">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 text-center">
              Try asking
            </p>
            <div className="relative" style={{ height: "52px" }}>
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="absolute inset-x-0 top-0 w-full text-left px-4 py-3 rounded-xl border text-sm cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f0fdfa, #ecfdf5)",
                    borderColor: "#99f6e4",
                    color: "#0f766e",
                    boxShadow: "0 2px 12px rgba(13,148,136,0.08)",
                    opacity: activeSuggestion === i ? 1 : 0,
                    transform:
                      activeSuggestion === i
                        ? "translateY(0)"
                        : "translateY(10px)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                    pointerEvents: activeSuggestion === i ? "auto" : "none",
                  }}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: "#ccfbf1", color: "#0d9488" }}
                    >
                      ?
                    </span>
                    {q}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-5 flex flex-col gap-4 px-5">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              onClarificationSubmit={onClarificationSubmit}
              onMissingSubmit={onMissingSubmit}
            />
          ))}
          {loading && <LoadingBubble />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

const THINKING_STEPS = [
  "Analysing query...",
  "Checking cache...",
  "Looking for frequent data...",
  "Fetching data...",
  "Formatting output...",
];

function LoadingBubble() {
  const [stepIndex, setStepIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (stepIndex >= THINKING_STEPS.length - 1) return;

    const delay = 1400 + Math.random() * 600;
    const timer = setTimeout(() => {
      setFading(true);
      // Wait for fade-out, then swap text and fade back in
      setTimeout(() => {
        setStepIndex((prev) => prev + 1);
        setFading(false);
      }, 250);
    }, delay);

    return () => clearTimeout(timer);
  }, [stepIndex]);

  return (
    <div className="flex items-start gap-2.5 msg-appear">
      <BotAvatar />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-teal-700 tracking-wide">
          Dr. Agent
        </span>
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm">
          {/* Spinner */}
          <span
            className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 shrink-0"
            style={{
              borderTopColor: "#0d9488",
              animation: "thinking-spin 0.7s linear infinite",
            }}
          />
          <span
            className="text-sm text-slate-500 transition-opacity duration-200"
            style={{
              opacity: fading ? 0 : 1,
              minWidth: "140px",
            }}
          >
            {THINKING_STEPS[stepIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}

export function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
      <svg
        width="14"
        height="14"
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
  );
}

export function BotAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm"
      style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6)" }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    </div>
  );
}
