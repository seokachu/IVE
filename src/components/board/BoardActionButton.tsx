import ActionButton from "@/components/common/button/ActionButton";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { useState } from "react";

interface BoardActionButtonProps {
  onEdit: () => void;
  onDelete: () => void;
}

const BoardActionButton = ({ onEdit, onDelete }: BoardActionButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClickDelete = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="shrink-0">
      <ActionButton
        onClick={onEdit}
        variant="default"
        className="border-none text-gray-500 mr-2"
      >
        수정
      </ActionButton>
      <ActionButton
        onClick={handleClickDelete}
        variant="default"
        className="border-none text-gray-500"
      >
        삭제
      </ActionButton>
      {isModalOpen && (
        <ConfirmModal
          isOpen={setIsModalOpen}
          onConfirm={onDelete}
          title="정말로 삭제하시겠습니까?"
          description="삭제 후 되돌릴 수 없습니다."
          cancelText="취소"
          confirmText="삭제"
        />
      )}
    </div>
  );
};

export default BoardActionButton;
