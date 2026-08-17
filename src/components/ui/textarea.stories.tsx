import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: { placeholder: "댓글을 입력해 주세요" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: "이번 앨범 진짜 최고예요! 콘서트도 꼭 가고 싶어요 🩷" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "로그인 후 작성할 수 있어요." },
};
