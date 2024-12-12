import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import WriteReviewForm from "./WriteReviewForm";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WriteReviewModal = ({ isOpen, onClose }: WriteReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] h-[80vh] overflow-y-auto py-16">
        <DialogHeader>
          <DialogTitle className="mb-4">리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">리뷰 작성</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center w-full">
          <WriteReviewForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
