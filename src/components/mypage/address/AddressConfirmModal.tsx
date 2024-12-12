import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddressConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const AddressConfirmModal = ({
  isOpen,
  onClose,
  onDelete,
}: AddressConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">배송지 삭제</DialogTitle>
          <DialogDescription>배송지를 삭제하시겠습니까?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex gap-2 w-full">
          <Button onClick={onDelete} variant="outline" className="w-full">
            삭제
          </Button>
          <Button variant="default" className="w-full" onClick={onClose}>
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressConfirmModal;
