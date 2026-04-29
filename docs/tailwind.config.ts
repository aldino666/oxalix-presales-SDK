import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        oxalix: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#059669",
          bg: "#050505",
          card: "#0a0a0a",
          border: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
