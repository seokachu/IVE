import * as React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";

import "pretendard/dist/web/variable/pretendardvariable.css";
import "../src/app/globals.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },
    //테마는 툴바 토글(html.dark)로 전환한다 — 배경 애드온과 겹치면 색이 어긋남
    backgrounds: { disable: true },
    docs: { toc: true },
    a11y: { test: "todo" },
    options: {
      storySort: {
        order: [
          "소개",
          "Foundations",
          ["Colors", "Typography", "Tokens"],
          "UI",
          "Common",
        ],
      },
    },
  },
  decorators: [
    //앱과 동일하게 html에 .dark를 붙여 next-themes(attribute="class") 환경을 재현
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <div className="min-h-[120px] bg-background p-6 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default preview;
