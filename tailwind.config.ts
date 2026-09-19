import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06080f",
        surface: {
          DEFAULT: "#0d131f",
          secondary: "#121a2b",
          elevated: "#182236",
          border: "#1e293b",
          borderHover: "#2d3d56",
        },
        cyber: {
          cyan: "#00E5FF",
          cobalt: "#3B82F6",
          navy: "#1E3A8A",
          glow: "rgba(0, 229, 255, 0.15)",
        },
        dispute: {
          DEFAULT: "#F43F5E",
          bg: "rgba(244, 63, 94, 0.12)",
          border: "rgba(244, 63, 94, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "page-enter": "pageEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "chat-send": "chatSend 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "status-pulse": "statusPulse 2.5s infinite ease-in-out",
        "radar-sweep": "radarSweep 4s linear infinite",
      },
      keyframes: {
        pageEnter: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        chatSend: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        statusPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.96)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        "radial-cyber": "radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.08) 0%, transparent 65%)",
        "radial-accent": "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
