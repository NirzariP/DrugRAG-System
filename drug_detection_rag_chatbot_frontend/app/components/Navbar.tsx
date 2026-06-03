import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-700/50"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      {/* Left — Logo + Name */}
      <Link href="/" className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v4M16 2v4" />
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18" />
            <circle cx="8" cy="16" r="1.5" fill="white" stroke="none" />
            <circle cx="16" cy="16" r="1.5" fill="white" stroke="none" />
            <path d="M10 15.5h4" />
          </svg>
        </div>
        <div>
          <h1 className="text-white text-sm font-bold tracking-wide leading-none">
            Dr. Drug Rag
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Pharmacological Data Platform
          </p>
        </div>
      </Link>
    </header>
  );
}
