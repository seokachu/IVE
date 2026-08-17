import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import SortDropdown, { type SortDropdownOption } from "@/components/common/select/SortDropdown";

const BOARD_OPTIONS: readonly SortDropdownOption[] = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "comments", label: "댓글순" },
];

const SHOP_OPTIONS: readonly SortDropdownOption[] = [
  { value: "recommend", label: "추천순" },
  { value: "low-price", label: "낮은 가격순" },
  { value: "high-price", label: "높은 가격순" },
  { value: "review", label: "리뷰 많은순" },
];

//선택값은 부모가 소유한다 — 실제 사용처(게시판·굿즈샵)와 동일한 형태로 상태를 붙인다
const Stateful = ({ options }: { options: readonly SortDropdownOption[] }) => {
  const [value, setValue] = useState(options[0].value);
  return <SortDropdown options={options} value={value} onChange={setValue} />;
};

const meta = {
  title: "Common/SortDropdown",
  component: SortDropdown,
  args: { options: BOARD_OPTIONS, value: "latest", onChange: fn() },
  parameters: {
    docs: {
      description: {
        component: "목록 정렬 공통 셀렉트. 라운드 필 트리거 + 선택 항목에 체크 표시. 게시판·굿즈샵·음악에서 공용으로 쓴다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[220px] justify-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SortDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => <Stateful options={BOARD_OPTIONS} />,
};

export const ShopOptions: Story = {
  render: () => <Stateful options={SHOP_OPTIONS} />,
};
