import { Trash2, CircleCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  isOpen: (value: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  cancelText: string;
  confirmText: string;
  /** destructive: 빨간 삭제 톤, primary: 브랜드 퍼플 톤 (기본) */
  variant?: "destructive" | "primary";
}

const ConfirmModal = ({
  isOpen,
  onConfirm,
  title,
  description,
  cancelText,
  confirmText,
  variant = "primary",
}: ConfirmModalProps) => {
  const isDestructive = variant === "destructive";

  const handleConfirm = () => {
    onConfirm();
    isOpen(false);
  };

  return (
    <Dialog open={true} onOpenChange={() => isOpen(false)}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl px-7 pb-7 pt-8">
        <div className="flex flex-col items-center">
          <span
            className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${
              isDestructive ? "bg-[#e7242417]" : "bg-purple-50"
            }`}
            aria-hidden="true"
          >
            {isDestructive ? (
              <Trash2 size={22} className="text-[#E72424]" />
            ) : (
              <CircleCheck size={22} className="text-purple-400" />
            )}
          </span>
          <DialogHeader className="mt-[18px] space-y-2">
            <DialogTitle className="text-lg font-bold text-center">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-[13px] text-gray-500 text-center">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="w-full flex items-center gap-2.5 mt-6">
            <button
              type="button"
              onClick={() => isOpen(false)}
              className="flex-1 h-[46px] rounded-full border border-gray-300 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 h-[46px] rounded-full flex items-center justify-center gap-1.5 text-sm font-bold text-white transition-all ${
                isDestructive
                  ? "bg-[#E72424] shadow-[0_4px_14px_rgba(231,36,36,0.25)] hover:bg-[#c81f1f]"
                  : "bg-gradient-to-b from-purple-400 to-purple-300 shadow-[0_4px_14px_rgba(219,151,233,0.35)] hover:from-purple-500 hover:to-purple-400"
              }`}
            >
              {isDestructive && <Trash2 size={15} />}
              {confirmText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
