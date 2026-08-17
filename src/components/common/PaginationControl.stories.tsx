import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import PaginationControl from "@/components/common/PaginationControl";

const Stateful = ({ totalPages, maxDisplayPages }: { totalPages: number; maxDisplayPages: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <PaginationControl
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      maxDisplayPages={maxDisplayPages}
    />
  );
};

const meta = {
  title: "Common/PaginationControl",
  component: PaginationControl,
  args: { currentPage: 1, totalPages: 12, maxDisplayPages: 5, onPageChange: fn() },
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
    maxDisplayPages: { control: { type: "number", min: 3, max: 9 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "게시판·굿즈샵 목록 하단 페이지네이션. 총 페이지가 `maxDisplayPages`를 넘으면 현재 페이지 주변만 노출하고 앞뒤에 말줄임을 넣는다.",
      },
    },
  },
} satisfies Meta<typeof PaginationControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};

//가운데 — 양쪽 말줄임이 모두 보이는 상태
export const MiddlePage: Story = {
  args: { currentPage: 7, totalPages: 20 },
};

export const LastPage: Story = {
  args: { currentPage: 12, totalPages: 12 },
};

//전체 페이지가 적으면 말줄임 없이 전부 노출
export const FewPages: Story = {
  args: { currentPage: 2, totalPages: 3 },
};

export const Interactive: Story = {
  render: () => <Stateful totalPages={20} maxDisplayPages={5} />,
};
