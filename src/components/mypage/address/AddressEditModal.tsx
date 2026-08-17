import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddressForm from "./AddressForm";
import type { AddressEditModalProps } from "@/types/mypage";

//배송지 수정 모달 — 추가 폼과 동일 구성, 값이 채워진 상태 (.pen "배송지 수정 모달" 시안)
const AddressEditModal = ({ isOpen, onClose, addressData }: AddressEditModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto rounded-3xl p-7 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">배송지 수정</DialogTitle>
          <DialogDescription className="sr-only">배송지 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <AddressForm mode="edit" initialData={addressData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddressEditModal;
