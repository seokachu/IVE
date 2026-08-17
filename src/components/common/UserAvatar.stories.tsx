import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import UserAvatar from "@/components/common/UserAvatar";

const meta = {
  title: "Common/UserAvatar",
  component: UserAvatar,
  args: { userId: "user-1", userName: "안유진" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "로그인 세션과 연결된 사용자 아바타. 프로필 이미지가 없으면 이름 첫 글자를 이니셜로 보여 주고, 배경색은 이름 해시로 고정된다. (스토리북에는 세션이 없어 항상 props 값이 쓰인다.)",
      },
    },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <UserAvatar {...args} size={size} />
          <span className="text-xs text-gray-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

//이름 해시로 색이 갈리는 파스텔 팔레트 4종
export const InitialPalette: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {["안유진", "가을", "레이", "장원영", "이서"].map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <UserAvatar {...args} userId={name} userName={name} size="lg" />
          <span className="text-xs text-gray-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const NoName: Story = {
  args: { userName: null, size: "lg" },
};
