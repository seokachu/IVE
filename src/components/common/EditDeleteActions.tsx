import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { cn } from "@/utils/utils";

//수정·삭제 필 버튼 쌍 + 삭제 확인 모달 공통 컴포넌트
//시안 기준 — sm: 댓글/대댓글(Comment/Actions), md: 마이페이지 배송지 카드(AActions)
interface EditDeleteActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  size?: "sm" | "md";
  confirmTitle?: string;
  confirmDescription?: string;
}

const EditDeleteActions = ({
  onEdit,
  onDelete,
  size = "md",
  confirmTitle = "삭제할까요?",
  confirmDescription = "삭제한 내용은 되돌릴 수 없어요.",
}: EditDeleteActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSm = size === "sm";
  const pill = cn("rounded-full", isSm ? "gap-1 px-2.5 py-1 text-[11px]" : "gap-[5px] px-3.5 py-[7px] text-[13px]");

  return (
    <div className={cn("flex items-center shrink-0", isSm ? "gap-1.5" : "gap-2")}>
      <Button
        variant="plain"
        size="auto"
        onClick={onEdit}
        className={cn(pill, "border border-gray-300 font-normal text-gray-500 hover:bg-gray-50")}
      >
        <Pencil size={isSm ? 11 : 13} />
        수정
      </Button>
      <Button
        variant="plain"
        size="auto"
        onClick={() => setIsModalOpen(true)}
        className={cn(pill, "bg-[#E7242417] font-semibold text-[#E72424] hover:bg-[#E7242426]")}
      >
        <Trash2 size={isSm ? 11 : 13} />
        삭제
      </Button>
      {isModalOpen && (
        <ConfirmModal
          isOpen={setIsModalOpen}
          onConfirm={onDelete}
          title={confirmTitle}
          description={confirmDescription}
          cancelText="취소"
          confirmText="삭제하기"
          variant="destructive"
        />
      )}
    </div>
  );
};

export default EditDeleteActions;
