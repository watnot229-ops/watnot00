import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10B981",
          hover: "#059669",
        },
        background: "#000000",
        surface: "#0A0A0A",
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1AA",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        heading: ["Clash Display", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
      borderRadius: {
        'xl': '16px',
        'lg': '12px',
        'md': '8px',
      }
    },
  },
  plugins: [],
};
export default config;
