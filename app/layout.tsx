import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JotNote PRO",
  description: "จดเร็ว จดง่าย ไม่ต้องล็อกอิน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen font-sans antialiased">
        <div className="mx-auto min-h-screen max-w-md bg-white shadow-card sm:max-w-lg md:max-w-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
