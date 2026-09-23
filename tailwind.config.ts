import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2", // Đậu TOEIC primary teal
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        duo: {
          green: "#58cc02", // Duolingo green
          greenDark: "#46a302",
          yellow: "#ffc800", // Duolingo star/streak yellow
          yellowDark: "#e5b200",
          blue: "#1cb0f6", // Duolingo sky blue
          blueDark: "#1899d6",
          red: "#ff4b4b", // Duolingo red
          redDark: "#d93838",
          purple: "#ce82ff",
          purpleDark: "#a559d9",
        },
      },
      boxShadow: {
        duo: "0 4px 0 0 rgba(0, 0, 0, 0.2)",
        "duo-green": "0 4px 0 0 #46a302",
        "duo-cyan": "0 4px 0 0 #0e7490",
        "duo-yellow": "0 4px 0 0 #e5b200",
        "duo-blue": "0 4px 0 0 #1899d6",
        "duo-red": "0 4px 0 0 #d93838",
      },
    },
  },
  plugins: [],
} satisfies Config;
