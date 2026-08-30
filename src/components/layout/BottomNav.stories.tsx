import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BottomNav from "@/components/layout/BottomNav";

//fixed bottom-0 + lg:hidden 이라 모바일 뷰포트에서 봐야 한다 — 데스크톱 캔버스에서는 숨겨진다
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
          "모바일(lg 미만) 하단 탭바 — 홈 + GNB 4개. 데스크톱 GNB·드로어 메뉴를 대신하며, 활성 탭은 purple-500(다크 purple-300)+semibold. 높이 56px + iOS safe-area, 탭바 위 요소는 `mb-tabbar`, 본문은 body `pb-tabbar`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[320px] bg-gray-50">
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
