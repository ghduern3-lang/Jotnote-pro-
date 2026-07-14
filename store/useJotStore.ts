"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Category = "ทบทวนบทเรียน" | "ไอเดีย" | "สิ่งที่ต้องซื้อ" | "เกมเมอร์";

export interface Note {
  id: string;
  emoji: string;
  title: string;
  category: Category;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProCode {
  code: string;
  expiresAt: number;
  createdAt: number;
}

interface RedeemResult {
  ok: boolean;
  reason?: "expired" | "invalid";
  expiresAt?: number;
}

interface JotState {
  notes: Note[];
  isPro: boolean;
  proExpiresAt: number | null;
  streak: number;
  email: string;
  customTheme: string | null;
  generatedCodes: ProCode[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  redeemCode: (code: string) => RedeemResult;
  generateCode: (days: number) => ProCode;
  loginWithEmail: (email: string) => void;
  setTheme: (base64: string) => void;
  clearTheme: () => void;
  bumpStreak: () => void;
  checkExpiry: () => void;
}

const PERMANENT_CODES = ["JOTNOTE-FREE", "PRO2026", "KRUFAINUM"];

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `PRO-${s}`;
}

export const useJotStore = create<JotState>()(
  persist(
    (set, get) => ({
      notes: [],
      isPro: false,
      proExpiresAt: null,
      streak: 0,
      email: "",
      customTheme: null,
      generatedCodes: [],

      addNote: (note) => {
        const now = Date.now();
        const newNote: Note = {
          ...note,
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: now,
          updatedAt: now,
        };
        set({ notes: [newNote, ...get().notes] });
      },

      redeemCode: (code: string): RedeemResult => {
        const clean = code.trim().toUpperCase();
        if (PERMANENT_CODES.includes(clean)) {
          set({ isPro: true, proExpiresAt: null });
          return { ok: true };
        }
        const found = get().generatedCodes.find((c) => c.code === clean);
        if (!found) return { ok: false, reason: "invalid" };
        if (found.expiresAt < Date.now()) return { ok: false, reason: "expired" };
        set({ isPro: true, proExpiresAt: found.expiresAt });
        return { ok: true, expiresAt: found.expiresAt };
      },

      generateCode: (days: number): ProCode => {
        const newCode: ProCode = {
          code: genCode(),
          expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
          createdAt: Date.now(),
        };
        set({ generatedCodes: [newCode, ...get().generatedCodes] });
        return newCode;
      },

      loginWithEmail: (email: string) => {
        const trialExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        set({ email, isPro: true, proExpiresAt: trialExpiry });
      },

      setTheme: (base64: string) => set({ customTheme: base64 }),
      clearTheme: () => set({ customTheme: null }),
      bumpStreak: () => set({ streak: get().streak + 1 }),

      checkExpiry: () => {
        const { isPro, proExpiresAt } = get();
        if (isPro && proExpiresAt && proExpiresAt < Date.now()) {
          set({ isPro: false, proExpiresAt: null });
        }
      },
    }),
    { name: "jotnote-pro-storage" }
  )
);