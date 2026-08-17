import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MoreLink from "@/components/common/MoreLink";
import SectionTitle from "@/components/common/SectionTitle";

const meta = {
  title: "Common/MoreLink",
  component: MoreLink,
  args: { href: "/shop" },
  parameters: {
    docs: { description: { component: "섹션 우측 상단의 “전체 보기 →” 링크. 라벨만 바꿔 재사용한다." } },
  },
} satisfies Meta<typeof MoreLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { href: "/news", label: "소식 더 보기" },
};

//실제 배치 예시 — 섹션 헤더 우측 정렬
export const InSectionHeader: Story = {
  render: (args) => (
    <div className="flex w-full max-w-2xl items-end justify-between">
      <SectionTitle title="NEWS" subtitle="아이브의 최신 소식" className="!items-start" />
      <MoreLink {...args} href="/news" />
    </div>
  ),
};
