import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        purple: {
          50: "var(--purple-50)",
          100: "var(--purple-100)",
          200: "var(--purple-200)",
          300: "var(--purple-300)",
          400: "var(--purple-400)",
          500: "var(--purple-500)",
          DEFAULT: "var(--purple-300)",
        },
        orange: {
          100: "var(--orange-100)",
          300: "var(--orange-300)",
          500: "var(--orange-500)",
          DEFAULT: "var(--orange-300)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        info: "var(--info)",
        kakao: "var(--kakao)",
        // Neutral 램프 — 기본 Tailwind gray를 디자인 시스템 값으로 재정의 (docs/design-system.md §1-1)
        // 불투명도 변형(bg-gray-500/90 등) 지원을 위해 hex 리터럴 사용
        // 다크모드에서 값이 플립되도록 CSS 변수 참조 (불투명도 변형이 필요하면 오버레이는 black/white 사용)
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          900: "var(--gray-900)",
        },
        red: {
          DEFAULT: "var(--red)",
          50: "#fef2f2",
          300: "#fca5a5",
          400: "#f87171",
          600: "#dc2626",
          700: "#b91c1c",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      // 컨테이너 폭 토큰 — 임의값(max-w-[1320px] 등) 대신 사용
      maxWidth: {
        container: "1320px",
        content: "1280px",
      },
      backgroundImage: {
        "main-image": "url('/images/main_bg.webp')",
        "news-hero-image": "url('/images/news_hero_bg.jpg')",
      },
      keyframes: {
        wheels: {
          "0%,100%": {
            transform: "translate(-50%,0)",
          },
          "50%": {
            transform: "translate(-50%,10px)",
          },
        },
        arrow: {
          "0%,100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(3px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "arrow-x": {
          "0%,100%": {
            transform: "translateX(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(4px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        wheels: "wheels 1.5s ease-in-out infinite",
        arrow: "arrow 1.2s infinite",
        "arrow-x": "arrow-x 1.2s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1024px",
      xl: "1320px",
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
