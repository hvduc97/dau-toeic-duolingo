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
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e", // LET'S English sprout green
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        earth: {
          50: "#fbf8f5",
          100: "#f5eee7",
          200: "#ead8cb",
          300: "#dabbab",
          400: "#c39783",
          500: "#aa765c",
          600: "#8d5b38", // Logo "English" brown
          700: "#75472d",
          800: "#5e3926",
          900: "#4e3122",
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
        "duo-cyan": "0 4px 0 0 #15803d",
        "duo-yellow": "0 4px 0 0 #e5b200",
        "duo-blue": "0 4px 0 0 #1899d6",
        "duo-red": "0 4px 0 0 #d93838",
        "duo-earth": "0 4px 0 0 #5e3926",
      },
    },
  },
  plugins: [],
} satisfies Config;
