"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Video, Users, Wifi, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: number;
  author: string;
  text: string;
  time: string;
  isAdmin?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

// Seed chat so it doesn't look empty on arrival
const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    author: "Praan Health",
    text: "🙏 Namaste everyone! Today's session is about to begin. Get your mat ready!",
    time: formatTime(new Date(Date.now() - 4 * 60000)),
    isAdmin: true,
  },
  {
    id: 2,
    author: "Sunita Ji",
    text: "Good morning! So excited for today 🌸",
    time: formatTime(new Date(Date.now() - 3 * 60000)),
  },
  {
    id: 3,
    author: "Praan Health",
    text: "Welcome Sunita Ji! 🌞 Make sure you have water nearby. Let's begin gently.",
    time: formatTime(new Date(Date.now() - 2 * 60000)),
    isAdmin: true,
  },
  {
    id: 4,
    author: "Ramesh Sharma",
    text: "My knee feels better since last week!",
    time: formatTime(new Date(Date.now() - 60000)),
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SessionPage() {
  // Replace this with your actual YouTube video ID once uploaded
  const YOUTUBE_VIDEO_ID = "KbZfBVkD6A0";

  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setViewerCount(Math.floor(Math.random() * 40) + 18);
  }, []);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isMounted) return null; // Avoids all hydration mismatch errors for dates/randoms


  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "You",
        text,
        time: formatTime(new Date()),
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#1a1410] flex flex-col">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Praan Health"
            className="h-6 sm:h-7 w-auto object-contain brightness-0 invert opacity-90"
          />
          <span className="hidden sm:inline text-[11px] font-medium uppercase tracking-widest text-[#dc4b32] bg-[#dc4b32]/10 border border-[#dc4b32]/20 px-2 py-0.5 rounded-full mt-0.5">
            Live Session
          </span>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-3 text-[13px] text-[#b8a898]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-400 animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {viewerCount} watching
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className="size-3.5 text-green-400" />
            <span className="hidden sm:inline">Connected</span>
          </span>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Video column */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* YouTube embed */}
          <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=1`}
              title="Praan Health Daily Yoga Session"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Session info bar */}
          <div className="bg-[#221a14] border-t border-white/5 px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <p className="font-display text-[#faf2e6] text-[15px] font-semibold">
                14-Day Senior Strength & Mobility — Daily Session
              </p>
              <p className="text-[12px] text-[#7a6a58] mt-0.5">
                Physician-backed · Gentle on joints · 45 minutes
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[12px] text-[#b8a898]">
              <Clock className="size-3.5" />
              <span suppressHydrationWarning>
                {new Date().toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}{" "}
                IST
              </span>
            </div>
          </div>

          {/* Attendance confirmation banner */}
          <div className="bg-[#dc4b32]/10 border-t border-[#dc4b32]/20 px-4 py-2.5 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#dc4b32] flex-shrink-0" />
            <p className="text-[12px] text-[#dc4b32] font-medium">
              ✅ You are marked as present for today&apos;s session
            </p>
          </div>
        </div>

        {/* ── Chat sidebar ────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-[340px] flex flex-col bg-[#1c1610] border-t lg:border-t-0 lg:border-l border-white/10 min-h-[360px] lg:min-h-0">
          {/* Sidebar header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-display text-[#faf2e6] text-[14px] font-semibold">
              Live Chat
            </h2>
            <span className="text-[11px] text-[#b8a898]">
              {messages.length} messages
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-0.5">
                {/* Author + time */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold ${msg.isAdmin ? "text-[#dc4b32]" : "text-[#c9a227]"
                      }`}
                  >
                    {msg.author}
                    {msg.isAdmin && (
                      <span className="ml-1.5 text-[9px] font-medium uppercase tracking-wider bg-[#dc4b32]/15 text-[#dc4b32] border border-[#dc4b32]/20 px-1.5 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-[#7a6a58]">{msg.time}</span>
                </div>
                {/* Text bubble */}
                <div
                  className={`text-[13px] leading-relaxed px-3 py-2 rounded-xl rounded-tl-sm w-fit max-w-[90%] ${msg.isAdmin
                    ? "bg-[#dc4b32]/10 text-[#fbe7db] border border-[#dc4b32]/15"
                    : "bg-white/5 text-[#e8ddd0]"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#dc4b32]/40 transition-colors">
              <input
                type="text"
                placeholder="Say something to the group…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-transparent text-[13px] text-[#e8ddd0] placeholder:text-[#7a6a58] outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="size-8 flex items-center justify-center rounded-lg bg-[#dc4b32] text-white disabled:opacity-30 hover:bg-[#b93a24] transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="size-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-[#7a6a58] mt-1.5 text-center">
              Messages are visible to all participants
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
