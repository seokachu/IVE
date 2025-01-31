"use client";
import { useId, useState } from "react";
import ActionButton from "../button/ActionButton";
import ConfirmModal from "../modal/ConfirmModal";

interface SelectionControlProps {
  totalItems: number;
  selectedCount: number;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteSelected: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
}

const SelectionControl = ({
  totalItems,
  selectedCount,
  onSelectAll,
  onDeleteSelected,
  onConfirm,
  title,
  description,
  cancelText,
  confirmText,
}: SelectionControlProps) => {
  const id = useId();
  const [isModal, setIsModal] = useState(false);

  //전체삭제 버튼 클릭시 모달
  const handleDeleteAll = () => {
    setIsModal(true);
  };

  return (
    <div className="flex text-sm items-center justify-between mt-5 pb-5 border-b border-dark-gray">
      <label htmlFor={`selectAll-${id}`} className="cursor-pointer">
        <input
          type="checkbox"
          id={`selectAll-${id}`}
          className="mr-[6px] w-4 h-4 translate-y-[3px]"
          checked={selectedCount === totalItems}
          onChange={onSelectAll}
        />
        전체선택 {selectedCount}/{totalItems}
      </label>
      <div className="flex gap-2">
        <ActionButton
          variant="outline"
          className="px-2 py-1 border rounded-md text-xs lg:text-sm"
          onClick={onDeleteSelected}
        >
          선택삭제
        </ActionButton>
        <ActionButton
          variant="primary"
          className="px-2 py-1 border rounded-md text-xs lg:text-sm"
          onClick={handleDeleteAll}
        >
          전체삭제
        </ActionButton>
      </div>
      {isModal && (
        <ConfirmModal
          isOpen={setIsModal}
          onConfirm={onConfirm}
          title={title}
          description={description}
          cancelText={cancelText}
          confirmText={confirmText}
        />
      )}
    </div>
  );
};

export default SelectionControl;
