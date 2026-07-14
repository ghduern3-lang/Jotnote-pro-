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
  expiresAt: number | null;
  maxUses: number | null;
  usedCount: number;
  createdAt: number;
}

interface RedeemResult {
  ok: boolean;
  reason?: "expired" | "invalid" | "full";
  expiresAt?: number | null;
}

interface JotState {
  notes: Note[];
  isPro: boolean;
  proExpiresAt: number | null;
  streak: number;
  email: string;
  customTheme: string | null;
  generatedCodes: ProCode[];
  adminEmails: string[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => void;
  getNote: (id: string) => Note | undefined;
  redeemCode: (code: string) => RedeemResult;
  generateCode: (opts: { code: string; days: number | null; maxUses: number | null }) => { ok: boolean; reason?: string };
  loginWithEmail: (email: string) => void;
  addAdminEmail: (email: string) => void;
  setTheme: (base64: string) => void;
  clearTheme: () => void;
  bumpStreak: () => void;
  checkExpiry: () => void;
}

const PERMANENT_CODES = ["JOTNOTE-FREE", "PRO2026", "KRUFAINUM"];

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
      adminEmails: ["ghduern3@gmail.com"],

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

      updateNote: (id, updates) => {
        set({
          notes: get().notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        });
      },

      getNote: (id) => get().notes.find((n) => n.id === id),

      redeemCode: (code: string): RedeemResult => {
        const clean = code.trim().toUpperCase();
        if (PERMANENT_CODES.includes(clean)) {
          set({ isPro: true, proExpiresAt: null });
          return { ok: true, expiresAt: null };
        }
        const codes = get().generatedCodes;
        const idx = codes.findIndex((c) => c.code === clean);
        if (idx === -1) return { ok: false, reason: "invalid" };
        const found = codes[idx];
        if (found.expiresAt && found.expiresAt < Date.now()) {
          return { ok: false, reason: "expired" };
        }
        if (found.maxUses !== null && found.usedCount >= found.maxUses) {
          return { ok: false, reason: "full" };
        }
        const nextCodes = [...codes];
        nextCodes[idx] = { ...found, usedCount: found.usedCount + 1 };
        set({ generatedCodes: nextCodes, isPro: true, proExpiresAt: found.expiresAt });
        return { ok: true, expiresAt: found.expiresAt };
      },

      generateCode: ({ code, days, maxUses }) => {
        const clean = code.trim().toUpperCase();
        if (!clean) return { ok: false, reason: "empty" };
        if (get().generatedCodes.some((c) => c.code === clean) || PERMANENT_CODES.includes(clean)) {
          return { ok: false, reason: "duplicate" };
        }
        const newCode: ProCode = {
          code: clean,
          expiresAt: days ? Date.now() + days * 24 * 60 * 60 * 1000 : null,
          maxUses: maxUses,
          usedCount: 0,
          createdAt: Date.now(),
        };
        set({ generatedCodes: [newCode, ...get().generatedCodes] });
        return { ok: true };
      },

      loginWithEmail: (email: string) => {
        const trialExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
        set({ email: email.trim().toLowerCase(), isPro: true, proExpiresAt: trialExpiry });
      },

      addAdminEmail: (email: string) => {
        const clean = email.trim().toLowerCase();
        if (!clean || get().adminEmails.includes(clean)) return;
        set({ adminEmails: [...get().adminEmails, clean] });
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