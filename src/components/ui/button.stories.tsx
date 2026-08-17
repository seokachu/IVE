import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const VARIANTS = [
  "default",
  "outlineBrand",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "kakao",
  "link",
  "plain",
] as const;

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "버튼" },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: ["default", "sm", "lg", "icon", "auto"] },
    asChild: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "서비스의 모든 버튼은 이 컴포넌트를 사용한다. 아이콘 전용·인라인 유틸리티 버튼은 `variant=\"plain\"` + `size=\"auto\"` 조합을 쓴다. 기본 `type`은 `button`이라 폼 안에서 의도치 않게 submit되지 않는다.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

//변형 전체 — 디자인 시스템 §4 Button 매핑표와 동일 순서
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        sm · h36
      </Button>
      <Button {...args} size="default">
        default · h40
      </Button>
      <Button {...args} size="lg">
        lg · h44
      </Button>
      <Button {...args} size="icon" aria-label="찜하기">
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <ShoppingCart className="h-4 w-4" />
        장바구니 담기
      </>
    ),
    size: "lg",
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} disabled>
        기본
      </Button>
      <Button {...args} variant="outlineBrand" disabled>
        아웃라인
      </Button>
      <Button {...args} variant="destructive" disabled>
        삭제
      </Button>
    </div>
  ),
};

//asChild — 링크를 버튼 스타일로 렌더 (a 태그 시맨틱 유지)
export const AsLink: Story = {
  args: { asChild: true, variant: "outlineBrand" },
  render: (args) => (
    <Button {...args}>
      <a href="#link">굿즈샵 바로가기</a>
    </Button>
  ),
};
