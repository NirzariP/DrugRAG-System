"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types/chat";
import { UserAvatar, BotAvatar } from "./MessageList";

type MessageBubbleProps = {
  message: ChatMessage;
  onClarificationSubmit?: (threadId: string, userInput: string) => void;
  onMissingSubmit?: (threadId: string, userInput: string) => void;
};

export default function MessageBubble({
  message,
  onClarificationSubmit,
  onMissingSubmit,
}: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex items-start gap-2.5 justify-end msg-appear">
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          <span className="text-xs font-semibold text-indigo-400 tracking-wide">
            You
          </span>
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-md text-white text-sm shadow-sm"
            style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
          >
            {message.content}
          </div>
        </div>
        <UserAvatar />
      </div>
    );
  }

  if (message.type === "error") {
    return (
      <div className="flex items-start gap-2.5 msg-appear">
        <BotAvatar />
        <div className="flex flex-col gap-1 max-w-[75%]">
          <span className="text-xs font-semibold text-teal-700 tracking-wide">
            Dr. Agent
          </span>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-red-50 text-slate-700 text-sm shadow-sm border border-red-200">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "normal") {
    const { data } = message;
    return (
      <div className="flex items-start gap-2.5 msg-appear">
        <BotAvatar />
        <div className="flex flex-col gap-1 max-w-[75%]">
          <span className="text-xs font-semibold text-teal-700 tracking-wide">
            Dr. Agent
          </span>
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white text-slate-700 text-sm shadow-sm border border-slate-100">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-base font-semibold mt-3 mb-1">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm font-semibold mt-3 mb-1">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mt-2 mb-1">
                    {children}
                  </h3>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),
                p: ({ children }) => (
                  <p className="mb-2 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-700">{children}</li>
                ),
              }}
            >
              {data.final_output}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "clarification") {
    return (
      <div className="flex items-start gap-2.5 msg-appear">
        <BotAvatar />
        <div className="flex flex-col gap-1 max-w-[75%]">
          <span className="text-xs font-semibold text-teal-700 tracking-wide">
            Dr. Agent
          </span>
          <ClarificationBubble
            message={message.message}
            threadId={message.threadId}
            onSubmit={onClarificationSubmit}
          />
        </div>
      </div>
    );
  }

  if (message.type === "missing") {
    return (
      <div className="flex items-start gap-2.5 msg-appear">
        <BotAvatar />
        <div className="flex flex-col gap-1 max-w-[75%]">
          <span className="text-xs font-semibold text-teal-700 tracking-wide">
            Dr. Agent
          </span>
          <MissingBubble
            message={message.message}
            threadId={message.threadId}
            onSubmit={onMissingSubmit}
          />
        </div>
      </div>
    );
  }

  return null;
}

type ClarificationBubbleProps = {
  message: string;
  threadId: string;
  onSubmit?: (threadId: string, userInput: string) => void;
};

function ClarificationBubble({
  message,
  threadId,
  onSubmit,
}: ClarificationBubbleProps) {
  const [correctionInput, setCorrectionInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    if (onSubmit) {
      onSubmit(threadId, "yes");
      setSubmitted(true);
    }
  };

  const handleCustomSubmit = () => {
    if (!correctionInput.trim() || !onSubmit) return;
    onSubmit(threadId, correctionInput.trim());
    setSubmitted(true);
  };

  return (
    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-amber-50 text-slate-700 border border-amber-200 shadow-sm text-sm">
      <p className="mb-3">{message}</p>

      {!submitted ? (
        <div className="space-y-2">
          <button
            onClick={handleConfirm}
            className="w-full text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
          >
            Yes, that&apos;s correct
          </button>

          <input
            type="text"
            value={correctionInput}
            onChange={(e) => setCorrectionInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            placeholder="Or type the correct name(s)..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white"
          />

          <button
            onClick={handleCustomSubmit}
            disabled={!correctionInput.trim()}
            className="w-full px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
          >
            Submit Correction
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">Response submitted ✓</p>
      )}
    </div>
  );
}

type MissingBubbleProps = {
  message: string;
  threadId: string;
  onSubmit?: (threadId: string, userInput: string) => void;
};

function MissingBubble({ message, threadId, onSubmit }: MissingBubbleProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || !onSubmit) return;
    onSubmit(threadId, input.trim());
    setSubmitted(true);
  };

  return (
    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-red-50 text-slate-700 border border-red-200 shadow-sm text-sm">
      <p className="mb-3">{message}</p>

      {!submitted ? (
        <div className="space-y-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter the missing value..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-full px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
          >
            Submit
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">Response submitted ✓</p>
      )}
    </div>
  );
}
