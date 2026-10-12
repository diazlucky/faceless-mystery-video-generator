import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/remotion/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: "#fcf8ed",
          DEFAULT: "#f4ecd8",
          dark: "#e8dcbe",
        },
        terminal: {
          green: "#00ff66",
          darkgreen: "#003b17",
          black: "#0a0d0a",
        },
        radar: {
          cyan: "#00f0ff",
          darkblue: "#040d1a",
          grid: "#0e2a47",
        },
      },
      fontFamily: {
        mono: ["Courier New", "Courier", "monospace"],
        serif: ["Georgia", "Cambria", "serif"],
        impact: ["Impact", "Arial Black", "sans-serif"],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-8px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(0,255,102,0.8))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 5px rgba(0,255,102,0.3))" },
        },
        radarSweep: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s infinite",
        radarSweep: "radarSweep 4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;

