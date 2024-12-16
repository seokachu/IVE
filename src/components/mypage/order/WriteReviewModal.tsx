import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import WriteReviewForm from "./WriteReviewForm";
import { Tables } from "@/types/supabase";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData?: Tables<"goods_reviews">;
}

const WriteReviewModal = ({
  isOpen,
  onClose,
  reviewData,
}: WriteReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] h-[80vh] py-16">
        <DialogHeader>
          <DialogTitle className="mb-4">리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">리뷰 작성</DialogDescription>
        </DialogHeader>
        <WriteReviewForm
          mode="create"
          reviewData={reviewData}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
