"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame } from "lucide-react";
import { useJotStore } from "@/store/useJotStore";
import { EMOJI_OPTIONS, CATEGORY_OPTIONS } from "@/lib/utils";
import type { Category } from "@/store/useJotStore";

export default function NewNotePage() {
  const router = useRouter();
  const addNote = useJotStore((s) => s.addNote);
  const bumpStreak = useJotStore((s) => s.bumpStreak);
  const customTheme = useJotStore((s) => s.customTheme);

  const [emoji, setEmoji] = useState("📝");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORY_OPTIONS[0]);
  const [content, setContent] = useState("");
  const [reviewMode, setReviewMode] = useState(false);

  const isReviewCategory = category === "ทบทวนบทเรียน";

  function handleSave() {
    if (!title.trim() && !content.trim()) {
      router.push("/");
      return;
    }
    addNote({ emoji, title: title.trim(), category, content });
    if (reviewMode) bumpStreak();
    router.push("/");
  }

  const bgStyle = customTheme
    ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.86), rgba(255,255,255,0.86)), url(${customTheme})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <main className="flex min-h-screen flex-col pb-10" style={bgStyle}>
      <header className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <button
          onClick={() => router.push("/")}
          aria-label="ย้อนกลับ"
          className="rounded-full p-1 text-gray-500 transition active:bg-gray-100"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-bold text-jot-ink">โน้ตใหม่</h1>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jot-purpleLight text-2xl transition active:scale-95"
            aria-label="เลือกอีโมจิ"
          >
            {emoji}
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="หัวเรื่อง"
            className="flex-1 border-b-2 border-gray-200 pb-2 text-lg font-bold text-jot-ink outline-none focus:border-jot-purple"
          />
        </div>

        {showEmojiPicker && (
          <div className="grid animate-popIn grid-cols-8 gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
            {EMOJI_OPTIONS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => {
                  setEmoji(em);
                  setShowEmojiPicker(false);
                }}
                className={`flex h-9 items-center justify-center rounded-lg text-xl transition hover:bg-jot-purpleLight ${
                  em === emoji ? "bg-jot-purpleLight" : ""
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-400">
            หมวดย่อย
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              setReviewMode(false);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-jot-ink outline-none focus:border-jot-purple"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {isReviewCategory && (
          <button
            type="button"
            onClick={() => setReviewMode((v) => !v)}
            className={`flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold shadow-sm transition active:scale-95 ${
              reviewMode
                ? "animate-flicker bg-amber-400 text-white"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <Flame size={16} />
            {reviewMode ? "โหมดทบทวนเปิดอยู่" : "เปิดโหมดทบทวน 🔥"}
          </button>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="เริ่มพิมพ์โน้ตของคุณที่นี่..."
          className={`min-h-[45vh] flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-base text-jot-ink outline-none focus:border-jot-purple ${
            isReviewCategory ? "paper-lines-review bg-amber-50" : "paper-lines bg-jot-paper"
          }`}
        />
      </div>

      <div className="px-5">
        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-jot-purple py-3.5 text-base font-bold text-white shadow-floaty transition active:scale-[0.98]"
        >
          บันทึก
        </button>
      </div>
    </main>
  );
}