import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        "silver-gray": "var(--silver-gray)",
        "dark-gray": "var(--dark-gray)",
        orange: "var(--orange)",
        pink: "var(--pink)",
        purple: "var(--purple)",
      },
      backgroundImage: {
        "main-image": "url('/images/main_bg.avif')",
      },
      keyframes: {
        wheels: {
          "0%,100%": { transform: "translate(-50%,0)" },
          "50%": { transform: "translate(-50%,10px)" },
        },
      },
      animation: {
        wheels: "wheels 1.5s ease-in-out infinite",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1320px",
    },
  },
  plugins: [],
};
export default config;
