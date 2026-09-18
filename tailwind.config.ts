import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // Neutral, Apple-like grays. Surfaces stay white/near-white in light mode.
        surface: {
          DEFAULT: "#FFFFFF",
          dim: "#F5F5F7",
          dark: "#0B0B0C",
          "dark-dim": "#161618",
        },
        ink: {
          DEFAULT: "#1D1D1F",
          soft: "#6E6E73",
          faint: "#AEAEB2",
          onDark: "#F5F5F7",
          onDarkSoft: "#98989D",
        },
        // Single brand action color. Used sparingly and deliberately.
        brand: {
          DEFAULT: "#1E8E5A",
          dim: "#E7F5EE",
          dark: "#166B44",
          onBrand: "#FFFFFF",
        },
        line: {
          DEFAULT: "rgba(60,60,67,0.14)",
          dark: "rgba(255,255,255,0.12)",
        },
        danger: "#D74B4B",
        warn: "#B8860B",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Inter"',
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        "sheet-in": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "check-draw": {
          "0%": { strokeDashoffset: "48" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "sheet-in": "sheet-in 0.38s cubic-bezier(0.32,0.72,0,1)",
        pop: "pop 0.28s cubic-bezier(0.32,0.72,0,1)",
        "check-draw": "check-draw 0.5s cubic-bezier(0.32,0.72,0,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
