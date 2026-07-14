"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { useJotStore } from "@/store/useJotStore";
import { timeAgo } from "@/lib/utils";

export default function HomePage() {
  const notes = useJotStore((s) => s.notes);
  const customTheme = useJotStore((s) => s.customTheme);
  const checkExpiry = useJotStore((s) => s.checkExpiry);

  useEffect(() => {
    checkExpiry();
  }, [checkExpiry]);

  const bgStyle = customTheme
    ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.86), rgba(255,255,255,0.86)), url(${customTheme})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <main className="relative flex min-h-screen flex-col pb-28" style={bgStyle}>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/90 px-5 py-4 backdrop-blur">
        <h1 className="text-xl font-extrabold tracking-tight text-jot-ink">
          JotNote<span className="text-jot-purple">💜</span>
        </h1>
        <Link
          href="/pro"
          className="flex items-center gap-1 rounded-full bg-jot-purple px-4 py-1.5 text-sm font-bold text-white shadow-sm transition active:scale-95"
        >
          <Sparkles size={14} />
          PRO
        </Link>
      </header>

      <section className="flex-1 px-5 py-6">
        {notes.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-4 text-5xl">📝</div>
            <p className="text-base font-medium text-gray-400">
              กด + เพื่อสร้างโน้ตแรกของคุณ
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {notes.map((note) => (
              <Link
                href={`/edit/${note.id}`}
                key={note.id}
                className="animate-popIn rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-2xl">{note.emoji}</span>
                  <h2 className="truncate font-bold text-jot-ink">
                    {note.title || "ไม่มีชื่อเรื่อง"}
                  </h2>
                </div>
                <p className="mb-2 text-xs font-medium text-gray-400">
                  {note.category}
                </p>
                <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                  {note.content || "ไม่มีเนื้อหา"}
                </p>
                <p className="text-[11px] text-gray-300">
                  {timeAgo(note.updatedAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Link
        href="/new"
        aria-label="สร้างโน้ตใหม่"
        className="fixed bottom-8 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-jot-purple text-white shadow-floaty transition active:scale-90"
      >
        <Plus size={30} strokeWidth={2.5} />
      </Link>
    </main>
  );
}