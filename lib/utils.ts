export function timeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "เมื่อสักครู่";
  if (diffMin < 60) return `แก้ไขล่าสุด ${diffMin} นาทีที่แล้ว`;
  if (diffHour < 24) return `แก้ไขล่าสุด ${diffHour} ชั่วโมงที่แล้ว`;
  return `แก้ไขล่าสุด ${diffDay} วันที่แล้ว`;
}

export const EMOJI_OPTIONS = [
  "📝", "💡", "📚", "🛒", "🎮", "⭐", "🔥", "🎯",
  "🧠", "🎨", "🚀", "🍕", "🎧", "🏆", "🧩", "📌",
];

export const CATEGORY_OPTIONS = [
  "ทบทวนบทเรียน",
  "ไอเดีย",
  "สิ่งที่ต้องซื้อ",
  "เกมเมอร์",
] as const;
