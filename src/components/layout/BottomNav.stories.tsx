import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BottomNav from "@/components/layout/BottomNav";

//fixed bottom-0 + lg:hidden 이라 모바일 뷰포트에서 봐야 한다 — 데스크톱 캔버스에서는 숨겨진다.
//글라스(배경 블러)가 보이도록 데코레이터에 그라데이션 배경을 깐다
const meta = {
  title: "Layout/BottomNav",
  component: BottomNav,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile2" },
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
    docs: {
      description: {
        component:
          "모바일(lg 미만) 하단 탭바 — iOS 글라스 스타일의 플로팅 캡슐(좌우 16px 인셋 · 64px · `bg-glass` + `backdrop-blur-xl` + `border-glass-stroke`). 홈 + GNB 4개, 활성 탭은 `bg-glass-accent` 필 + purple-500(다크 purple-300) semibold. 캡슐 아래 8px + iOS safe-area까지가 `--tabbar-h` — 탭바 위 요소는 `mb-tabbar`, 본문은 body `pb-tabbar`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[320px] bg-gradient-to-br from-purple-200 via-orange-100 to-purple-50 dark:from-purple-100 dark:via-gray-100 dark:to-purple-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const NewsActive: Story = {
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/news" } } },
};

export const BoardDetailActive: Story = {
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/board/135" } } },
};
