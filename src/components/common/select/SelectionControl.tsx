"use client";
import { useId, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-between px-1 pb-1 text-sm">
      <label htmlFor={`selectAll-${id}`} className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          id={`selectAll-${id}`}
          checked={selectedCount === totalItems}
          onChange={onSelectAll}
        />
        <span className="font-semibold">전체선택</span>
        <span className="text-gray-400">
          {selectedCount}/{totalItems}
        </span>
      </label>
      <div className="flex gap-2">
        <Button
          variant="plain"
          size="auto"
          className="rounded-full border border-gray-300 px-3.5 py-1.5 text-[13px] text-gray-500 hover:bg-gray-50"
          onClick={onDeleteSelected}
        >
          선택삭제
        </Button>
        <Button
          variant="plain"
          size="auto"
          className="flex items-center gap-1.5 rounded-full bg-[#e7242417] px-3.5 py-1.5 text-[13px] font-semibold text-[#E72424] hover:bg-[#e7242429]"
          onClick={handleDeleteAll}
        >
          <Trash2 size={13} />
          전체 비우기
        </Button>
      </div>
      {isModal && (
        <ConfirmModal
          isOpen={setIsModal}
          onConfirm={onConfirm}
          variant="destructive"
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
