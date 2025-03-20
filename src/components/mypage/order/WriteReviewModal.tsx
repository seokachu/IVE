import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import WriteReviewForm from './WriteReviewForm';
import type { WriteReviewModalProps } from '@/types/mypage';

const WriteReviewModal = ({ isOpen, onClose, reviewData, orderId, goodsId, mode }: WriteReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[calc(100vh-4rem)] overflow-y-auto py-16">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">리뷰 작성</DialogDescription>
        </DialogHeader>
        <WriteReviewForm
          mode={mode}
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
