import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import WriteReviewForm from "./WriteReviewForm";
import type { WriteReviewModalProps } from "@/types/mypage";

//리뷰 작성 모달 — 상품 정보 로우 + 별점 + 텍스트영역 (.pen "리뷰 쓰기 모달" 시안)
const WriteReviewModal = ({
  isOpen,
  onClose,
  reviewData,
  orderId,
  goodsId,
  mode,
  productName,
  productImage,
  productOption,
}: WriteReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto rounded-3xl p-7 sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">리뷰 작성</DialogTitle>
          <DialogDescription className="sr-only">구매한 굿즈의 리뷰를 작성합니다.</DialogDescription>
        </DialogHeader>
        {productName && (
          <>
            <div className="flex items-center gap-3">
              {productImage && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image src={productImage} alt={productName} width={96} height={96} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{productName}</p>
                {productOption && <p className="mt-0.5 text-xs uppercase text-gray-400">{productOption}</p>}
              </div>
            </div>
            <hr className="border-gray-200" />
          </>
        )}
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
