import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import EditDeleteActions from "@/components/common/EditDeleteActions";

const meta = {
  title: "Common/EditDeleteActions",
  component: EditDeleteActions,
  args: { onEdit: fn(), onDelete: fn() },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  parameters: {
    docs: {
      description: {
        component:
          "수정·삭제 필 버튼 쌍. 삭제를 누르면 확인 모달이 뜨고, 확인했을 때만 `onDelete`가 호출된다. sm은 댓글·대댓글, md는 마이페이지 카드용.",
      },
    },
  },
} satisfies Meta<typeof EditDeleteActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: { size: "md" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const CustomConfirmText: Story = {
  args: {
    size: "md",
    confirmTitle: "배송지를 삭제할까요?",
    confirmDescription: "기본 배송지로 등록된 주소는 다시 지정해야 해요.",
  },
};

//댓글 헤더에 놓였을 때의 실제 배치
export const InCommentHeader: Story = {
  args: { size: "sm" },
  render: (args) => (
    <div className="w-full max-w-md rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-500">
            다
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold">다이브</span>
            <span className="text-[11px] text-gray-400">방금 전</span>
          </div>
        </div>
        <EditDeleteActions {...args} />
      </div>
      <p className="mt-3 text-sm">이번 컴백 콘셉트 진짜 좋아요 🩷</p>
    </div>
  ),
};
