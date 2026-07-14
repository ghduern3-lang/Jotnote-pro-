"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  KeyRound,
  Image as ImageIcon,
  LogIn,
  Trash2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { useJotStore } from "@/store/useJotStore";

const FEATURES = [
  "สร้างหัวเรื่องไม่จำกัด",
  "ธีมสีม่วง + สร้างธีมจากรูปเอง",
  "โหมดทบทวน + Streak ไฟลุก 🔥",
  "สำรองข้อมูลขึ้นคลาวด์",
];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function ProPage() {
  const router = useRouter();
  const isPro = useJotStore((s) => s.isPro);
  const proExpiresAt = useJotStore((s) => s.proExpiresAt);
  const email = useJotStore((s) => s.email);
  const customTheme = useJotStore((s) => s.customTheme);
  const redeemCode = useJotStore((s) => s.redeemCode);
  const generateCode = useJotStore((s) => s.generateCode);
  const loginWithEmail = useJotStore((s) => s.loginWithEmail);
  const setTheme = useJotStore((s) => s.setTheme);
  const clearTheme = useJotStore((s) => s.clearTheme);

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [showLogin, setShowLogin] = useState(false);
  const [mail, setMail] = useState("");
  const [mailError, setMailError] = useState(false);

  const [showAdmin, setShowAdmin] = useState(false);
  const [genDays, setGenDays] = useState(7);
  const [generated, setGenerated] = useState<{ code: string; expiresAt: number } | null>(null);

  function handleUnlockClick() {
    alert("ขอบคุณ! ให้ผู้ปกครองติดต่อ Line: @jotnote");
  }

  function handleRedeem() {
    const res = redeemCode(code);
    if (res.ok) {
      setCodeMsg({
        ok: true,
        text: res.expiresAt
          ? `ปลดล็อกสำเร็จ! ใช้ได้ถึง ${new Date(res.expiresAt).toLocaleDateString("th-TH")}`
          : "ปลดล็อก PRO ถาวรเรียบร้อยแล้ว 💜",
      });
      setShowCodeInput(false);
      setCode("");
    } else if (res.reason === "expired") {
      setCodeMsg({ ok: false, text: "โค้ดนี้หมดอายุแล้ว" });
    } else {
      setCodeMsg({ ok: false, text: "โค้ดไม่ถูกต้อง ลองใหม่อีกครั้งนะ" });
    }
  }

  function handleLogin() {
    if (!isValidEmail(mail)) {
      setMailError(true);
      return;
    }
    loginWithEmail(mail);
    setShowLogin(false);
  }

  function handleGenerate() {
    const result = generateCode(genDays);
    setGenerated(result);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert("ไฟล์รูปใหญ่ไปนิดนึง ลองเลือกไฟล์ที่เล็กกว่า 2MB นะ");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setTheme(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen pb-14">
      <header className="relative overflow-hidden bg-gradient-to-br from-jot-purple via-violet-500 to-fuchsia-500 px-5 pb-10 pt-5 text-white">
        <button
          onClick={() => router.push("/")}
          aria-label="ย้อนกลับ"
          className="rounded-full p-1 transition active:bg-white/20"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-extrabold leading-snug">
            ปลดล็อก JotNote PRO 💜
          </h1>
          {isPro && (
            <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              คุณเป็นสมาชิก PRO {proExpiresAt ? `ถึง ${new Date(proExpiresAt).toLocaleDateString("th-TH")}` : "ตลอดชีพ"} ✨
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -right-6 top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      </header>

      <section className="-mt-6 mx-5 rounded-2xl bg-white p-5 shadow-card">
        <ul className="flex flex-col gap-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm font-medium text-jot-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jot-purpleLight text-jot-purple">
                <Check size={14} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-3 text-sm font-bold text-gray-400">ธีมจากรูปของคุณเอง</h2>
        {!isPro ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-sm text-gray-500">
            <ImageIcon size={20} className="shrink-0 text-violet-400" />
            ปลดล็อก PRO ก่อนเพื่ออัปโหลดรูปมาทำเป็นธีมพื้นหลังของคุณเอง
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 p-4 shadow-card">
            {customTheme ? (
              <div className="mb-3 flex items-center gap-3">
                <img src={customTheme} alt="ธีมปัจจุบัน" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 text-sm font-medium text-gray-600">ใช้เป็นธีมพื้นหลังอยู่</div>
                <button
                  onClick={clearTheme}
                  className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500 active:scale-95"
                >
                  <Trash2 size={13} /> ลบ
                </button>
              </div>
            ) : (
              <p className="mb-3 text-xs text-gray-400">ยังไม่ได้ตั้งธีม — เลือกรูปจากเครื่องของคุณด้านล่าง</p>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-jot-purpleLight py-2.5 text-sm font-bold text-jot-purple active:scale-[0.98]">
              <ImageIcon size={16} />
              เลือกรูปจากเครื่อง
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          </div>
        )}
      </section>

      <section className="px-5 pt-6">
        <button
          onClick={() => setShowLogin((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <LogIn size={16} className="text-jot-purple" />
            {email ? `เข้าสู่ระบบด้วย ${email}` : "เข้าสู่ระบบด้วย Gmail (ไม่บังคับ)"}
          </span>
          <span className="text-xs font-bold text-jot-purple">ทดลอง PRO 7 วันฟรี</span>
        </button>
        {showLogin && !email && (
          <div className="mt-3 animate-popIn rounded-xl border border-gray-100 bg-gray-50 p-3">
            <input
              value={mail}
              onChange={(e) => {
                setMail(e.target.value);
                setMailError(false);
              }}
              placeholder="เช่น name@gmail.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-jot-purple"
            />
            {mailError && (
              <p className="mt-1 text-xs font-medium text-red-500">ใส่อีเมลให้ถูกรูปแบบก่อนนะ</p>
            )}
            <p className="mt-1 text-[11px] text-gray-400">
              ระบบนี้ยังไม่ใช่การล็อกอินจริง ไม่มีการยืนยันตัวตนหรือส่งอีเมลออกไปไหน แค่ใช้เก็บสถานะ PRO ทดลองไว้ในเบราว์เซอร์นี้เท่านั้น
            </p>
            <button
              onClick={handleLogin}
              className="mt-2 w-full rounded-lg bg-jot-purple py-2 text-sm font-bold text-white transition active:scale-[0.98]"
            >
              เข้าสู่ระบบ & รับ PRO 7 วัน
            </button>
          </div>
        )}
      </section>

      <section className="px-5 pt-8">
        <button
          onClick={handleUnlockClick}
          className="w-full animate-pulse rounded-2xl bg-gradient-to-r from-jot-purple to-fuchsia-500 py-4 text-base font-extrabold text-white shadow-floaty transition active:scale-[0.98]"
        >
          ปลดล็อกเพียง 29฿/เดือน หรือใส่โค้ด
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowCodeInput((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-jot-purple underline underline-offset-2"
          >
            <KeyRound size={14} />
            ใส่โค้ด PRO
          </button>
        </div>

        {showCodeInput && (
          <div className="mt-3 animate-popIn rounded-xl border border-gray-100 bg-gray-50 p-3">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeMsg(null);
              }}
              placeholder="กรอกโค้ด PRO ของคุณ"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-jot-purple"
            />
            {codeMsg && (
              <p className={`mt-1 text-xs font-medium ${codeMsg.ok ? "text-green-600" : "text-red-500"}`}>
                {codeMsg.text}
              </p>
            )}
            <button
              onClick={handleRedeem}
              className="mt-2 w-full rounded-lg bg-jot-purple py-2 text-sm font-bold text-white transition active:scale-[0.98]"
            >
              ยืนยันโค้ด
            </button>
          </div>
        )}
      </section>

      <section className="px-5 pt-8">
        <button
          onClick={() => setShowAdmin((v) => !v)}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-400"
        >
          <ShieldCheck size={14} />
          แผงเจ้าของเว็บ: สร้างโค้ด PRO
        </button>
        {showAdmin && (
          <div className="mt-3 animate-popIn rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-[11px] text-gray-400">
              โค้ดที่สร้างตรงนี้เก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น ใช้แลกได้เฉพาะบนเครื่อง/เบราว์เซอร์เดียวกัน
            </p>
            <div className="mb-3 flex gap-2">
              {[3, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setGenDays(d)}
                  className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                    genDays === d ? "bg-jot-purple text-white" : "border border-gray-200 bg-white text-gray-500"
                  }`}
                >
                  {d} วัน
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              className="w-full rounded-lg bg-gray-800 py-2 text-sm font-bold text-white active:scale-[0.98]"
            >
              สร้างโค้ดใหม่
            </button>
            {generated && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
                <div>
                  <p className="font-mono text-sm font-bold text-jot-purple">{generated.code}</p>
                  <p className="text-[11px] text-gray-400">
                    หมดอายุ {new Date(generated.expiresAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(generated.code)}
                  className="rounded-lg bg-jot-purpleLight p-2 text-jot-purple active:scale-90"
                >
                  <Copy size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}