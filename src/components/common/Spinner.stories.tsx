import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Spinner from "@/components/common/Spinner";

const meta = {
  title: "Common/Spinner",
  component: Spinner,
  parameters: {
    docs: { description: { component: "로딩 표시는 이 컴포넌트 하나로 통일한다 (디자인 시스템 §6)." } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={36} />
      <Spinner size={48} />
    </div>
  ),
};

//버튼 내부 로딩 등 색을 상속시켜야 할 때
export const OnBrandSurface: Story = {
  render: () => (
    <div className="flex h-24 w-48 items-center justify-center rounded-lg bg-purple-300">
      <Spinner className="text-white" />
    </div>
  ),
};
