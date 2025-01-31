import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ActionButton from "../button/ActionButton";

interface ConfirmModalProps {
  isOpen: (value: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  cancelText: string;
  confirmText: string;
}

const ConfirmModal = ({
  isOpen,
  onConfirm,
  title,
  description,
  cancelText,
  confirmText,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    isOpen(false);
  };

  return (
    <Dialog open={true} onOpenChange={() => isOpen(false)}>
      <DialogContent className="sm:max-w-[425px] py-10">
        <DialogHeader>
          <DialogTitle className="mb-3">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:w-full sm:justify-center mt-3">
          <ActionButton
            variant="primary"
            onClick={() => isOpen(false)}
            className="w-full text-xs py-2"
          >
            {cancelText}
          </ActionButton>
          <ActionButton
            variant="outline"
            onClick={handleConfirm}
            className="w-full text-xs py-2"
          >
            {confirmText}
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
