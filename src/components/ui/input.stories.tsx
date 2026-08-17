import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Input",
  component: Input,
  args: { placeholder: "이메일을 입력해 주세요" },
  argTypes: { error: { control: "boolean" } },
  parameters: {
    docs: {
      description: {
        component:
          "h48 · radius-lg 인풋. `error`를 넘기면 테두리·포커스 링이 destructive로 바뀐다. `type=\"checkbox\"`는 globals.css에서 18px 브랜드 체크박스로 재정의된다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">이메일</Label>
      <Input {...args} id="email" type="email" />
    </div>
  ),
};

export const Error: Story = {
  args: { error: true, defaultValue: "dive@" },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Input {...args} />
      <p className="text-xs text-destructive">올바른 이메일 형식이 아니에요.</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "dive@ive.com" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "비밀번호를 입력해 주세요", defaultValue: "divedive" },
};

//체크박스 — 네이티브 input을 globals.css에서 브랜드 스타일로 재정의
export const Checkbox: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm">
        <Input type="checkbox" defaultChecked />
        전체 동의
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Input type="checkbox" />
        마케팅 정보 수신 (선택)
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-400">
        <Input type="checkbox" disabled />
        비활성
      </label>
    </div>
  ),
};
