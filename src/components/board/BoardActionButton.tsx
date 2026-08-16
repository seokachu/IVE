import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import type { BoardActionButtonProps } from "@/types/board";

const BoardActionButton = ({ onEdit, onDelete, mode = "default" }: BoardActionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickDelete = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {mode === "default" ? (
        <div className="shrink-0">
          <Button onClick={onEdit} variant="outline" size="auto" className="border-none text-gray-500 mr-2">
            수정
          </Button>
          <Button onClick={handleClickDelete} variant="outline" size="auto" className="border-none text-gray-500">
            삭제
          </Button>
          {isModalOpen && (
            <ConfirmModal
              isOpen={setIsModalOpen}
              onConfirm={onDelete}
              title="댓글을 삭제할까요?"
              description="삭제한 댓글은 되돌릴 수 없어요."
              cancelText="취소"
              confirmText="삭제하기"
              variant="destructive"
            />
          )}
        </div>
      ) : (
        <div className="shrink-0">
          <Button onClick={onEdit} variant="outline" size="auto" className="border-none text-gray-500 mr-2">
            취소
          </Button>
        </div>
      )}
    </>
  );
};

export default BoardActionButton;
