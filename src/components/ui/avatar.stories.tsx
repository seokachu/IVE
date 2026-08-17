import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "이미지가 없으면 이름 첫 글자를 파스텔 이니셜로 대체한다. 로그인 세션과 엮인 사용자 아바타는 `Common/UserAvatar`가 이 컴포넌트를 감싸 처리한다.",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

//이미지 로드 실패 시 fallback — 스토리북에서는 항상 이니셜이 보인다
export const Fallback: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} className="h-10 w-10 border">
        <AvatarFallback className="h-full w-full bg-purple-100 font-bold leading-none text-purple-500">
          안
        </AvatarFallback>
      </Avatar>
      <Avatar {...args} className="h-10 w-10 border">
        <AvatarFallback className="h-full w-full bg-orange-100 font-bold leading-none text-orange-500">
          가
        </AvatarFallback>
      </Avatar>
      <Avatar {...args} className="h-10 w-10 border">
        <AvatarFallback className="h-full w-full bg-gray-100 font-bold leading-none text-gray-600">
          레
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {[
        { size: "h-[25px] w-[25px]", text: "text-[11px]", label: "xs" },
        { size: "h-[30px] w-[30px]", text: "text-xs", label: "sm" },
        { size: "h-10 w-10", text: "text-[15px]", label: "md" },
        { size: "h-12 w-12", text: "text-base", label: "lg" },
        { size: "h-16 w-16", text: "text-xl", label: "xl" },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <Avatar {...args} className={`border ${item.size}`}>
            <AvatarFallback className={`h-full w-full bg-purple-100 font-bold leading-none text-purple-500 ${item.text}`}>
              다
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args} className="h-16 w-16 border">
      <AvatarImage src="/images/main_bg.webp" alt="프로필 이미지" />
      <AvatarFallback className="h-full w-full bg-purple-100 font-bold text-purple-500">아</AvatarFallback>
    </Avatar>
  ),
};
