import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { Button } from "@/components/ui/button";

//모달은 열린 상태로만 렌더되는 컴포넌트라, 스토리에서는 트리거 버튼으로 열고 닫는다
const Trigger = ({
  variant,
  title,
  description,
  confirmText,
}: {
  variant: "primary" | "destructive";
  title: string;
  description: string;
  confirmText: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button variant="outlineBrand" onClick={() => setIsOpen(true)}>
        모달 열기
      </Button>
      {isOpen && (
        <ConfirmModal
          isOpen={setIsOpen}
          onConfirm={fn()}
          title={title}
          description={description}
          cancelText="취소"
          confirmText={confirmText}
          variant={variant}
        />
      )}
    </>
  );
};

const meta = {
  title: "Common/ConfirmModal",
  component: ConfirmModal,
  args: {
    isOpen: fn(),
    onConfirm: fn(),
    title: "삭제할까요?",
    description: "삭제한 내용은 되돌릴 수 없어요.",
    cancelText: "취소",
    confirmText: "삭제하기",
    variant: "destructive",
  },
  parameters: {
    docs: {
      description: {
        component:
          "확인·취소 두 갈래 모달. `destructive`는 삭제 계열(레드), `primary`는 일반 확인(브랜드 그라데이션)에 쓴다. 열림 상태는 부모가 관리한다.",
      },
    },
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {
  render: () => (
    <Trigger
      variant="destructive"
      title="삭제할까요?"
      description="삭제한 내용은 되돌릴 수 없어요."
      confirmText="삭제하기"
    />
  ),
};

export const Primary: Story = {
  render: () => (
    <Trigger
      variant="primary"
      title="주문을 완료할까요?"
      description="결제 후에는 배송지 변경이 어려울 수 있어요."
      confirmText="주문하기"
    />
  ),
};
