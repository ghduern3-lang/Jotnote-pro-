import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jot: {
          purple: "#8B5CF6",
          purpleDark: "#7C3AED",
          purpleLight: "#EDE9FE",
          paper: "#FFFDF9",
          ink: "#1F2937",
        },
      },
      boxShadow: {
        floaty: "0 10px 30px -6px rgba(139, 92, 246, 0.45)",
        card: "0 2px 10px -2px rgba(31, 41, 55, 0.08)",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        flicker: {
          "0%, 100%": { transform: "scale(1) rotate(-2deg)" },
          "50%": { transform: "scale(1.08) rotate(2deg)" },
        },
      },
      animation: {
        popIn: "popIn 0.18s ease-out",
        flicker: "flicker 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
