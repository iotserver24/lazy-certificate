import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#374151",
        input: "#374151",
        ring: "#3b82f6",
        background: "#111827",
        foreground: "#f9fafb",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#f9fafb",
        },
        secondary: {
          DEFAULT: "#374151",
          foreground: "#f9fafb",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f9fafb",
        },
        muted: {
          DEFAULT: "#374151",
          foreground: "#9ca3af",
        },
        accent: {
          DEFAULT: "#374151",
          foreground: "#f9fafb",
        },
        popover: {
          DEFAULT: "#1f2937",
          foreground: "#f9fafb",
        },
        card: {
          DEFAULT: "#1f2937",
          foreground: "#f9fafb",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
