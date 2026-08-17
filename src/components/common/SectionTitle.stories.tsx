import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SectionTitle from "@/components/common/SectionTitle";

const meta = {
  title: "Common/SectionTitle",
  component: SectionTitle,
  args: {
    title: "GOODS SHOP",
    subtitle: "아이브의 공식 굿즈를 만나 보세요",
  },
  parameters: {
    docs: { description: { component: "메인·서브 페이지 공통 섹션 헤더. 반응형으로 lg 이상에서 타이틀이 4xl로 커진다." } },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongSubtitle: Story = {
  args: {
    title: "SCHEDULE",
    subtitle: "콘서트, 팬사인회, 방송 출연까지 아이브의 모든 일정을 한 곳에서 확인하세요",
  },
};
