import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        samsung: {
          primary: "#1428A0",
          dark: "#0D47A1",
          light: "#E3F2FD",
          accent: "#00A0E9",
          bg: "#FAFBFF",
          "bg-dark": "#0A1628",
        },
        hynix: {
          primary: "#E4002B",
          dark: "#C62828",
          light: "#FFEBEE",
          accent: "#FF6B35",
          bg: "#FFFBFA",
          "bg-dark": "#1A0A0A",
        },
      },
      fontFamily: {
        display: ["Pretendard Variable", "Pretendard", "sans-serif"],
        body: ["Pretendard Variable", "Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
