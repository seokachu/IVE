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
  reviewData?: Tables<"goods_reviews"> | null;
  orderId: string;
  goodsId: string;
}

const WriteReviewModal = ({
  isOpen,
  onClose,
  reviewData,
  orderId,
  goodsId,
}: WriteReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] h-[80vh] py-16">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">리뷰 작성</DialogDescription>
        </DialogHeader>
        <WriteReviewForm
          mode="create"
          reviewData={reviewData || undefined}
          onClose={onClose}
          orderId={orderId}
          goodsId={goodsId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
