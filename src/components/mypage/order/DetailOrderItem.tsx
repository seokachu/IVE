import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { toast } from "@/hooks/use-toast";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";
import WriteReviewModal from "./WriteReviewModal";
import { useOrderItemReview } from "@/hooks/queries/useReviews";
import { useRouter } from "next/navigation";
import type { DetailOrderItemProps } from "@/types/mypage";

//주문 상품 로우 — 구매확정 칩 + 상태별 액션 필 (.pen "마이페이지 · 주문 상세" 시안의 OItemRow)
const DetailOrderItem = ({ item, onConfirm, isLast = false }: DetailOrderItemProps) => {
  const { push } = useRouter();
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const { data: reviewData } = useOrderItemReview(item.order_id, item.product_id);
  const price = getDiscountedPrice(item);

  const handleConfirmOrder = () => {
    onConfirm();
    toast({
      title: "구매가 확정되었습니다.",
      description: item.product_name,
    });
  };

  //구매확정 상태이고 리뷰가 있으면 리뷰수정, 없으면 리뷰쓰기
  const getButtonText = () => {
    if (!item.is_confirmed) return "구매확정";
    return reviewData ? "리뷰 수정" : "리뷰 쓰기";
  };

  const getButtonStyle = () => {
    if (!item.is_confirmed) return "bg-purple-300 font-bold text-white hover:bg-purple-400";
    if (reviewData) return "border border-gray-300 font-semibold text-gray-500 hover:bg-gray-50";
    return "bg-purple-50 font-semibold text-purple-500 hover:bg-purple-100 dark:text-purple-300";
  };

  //모달 mode
  const getReviewMode = () => {
    return reviewData ? "edit" : "create";
  };

  const onClickDetail = () => {
    push(`/shop/${item.product_id}`);
  };

  return (
    <li className={`flex items-center gap-4 p-5 ${isLast ? "" : "border-b border-gray-200"}`}>
      {item.product_image && (
        <button
          type="button"
          onClick={onClickDetail}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200"
          aria-label={`${item.product_name} 상품 페이지로 이동`}
        >
          <Image
            src={item.product_image}
            alt={item.product_name}
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {item.is_confirmed && (
          <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-success">
            <Check size={12} aria-hidden="true" />
            구매확정
          </p>
        )}
        <h3 onClick={onClickDetail} className="cursor-pointer truncate text-[15px] font-semibold hover:underline">
          {item.product_name}
        </h3>
        <p className="mt-0.5 text-xs uppercase text-gray-400">
          색상 {item.color} / 사이즈 {item.size} / 수량 {item.quantity}개
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          {price !== item.price && <s className="text-xs text-gray-300">{formatPrice(item.price * item.quantity)}원</s>}
          <strong className="text-sm font-bold">{formatPrice(price * item.quantity)}원</strong>
        </div>
      </div>
      <button
        type="button"
        onClick={item.is_confirmed ? () => setIsReviewModal(true) : () => setIsConfirmModal(true)}
        className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] transition-colors ${getButtonStyle()}`}
      >
        {getButtonText()}
      </button>
      {isConfirmModal && (
        <ConfirmModal
          isOpen={setIsConfirmModal}
          onConfirm={handleConfirmOrder}
          title="구매를 확정할까요?"
          description="구매 확정 후에는 취소나 변경이 불가능해요."
          cancelText="취소"
          confirmText="구매확정"
        />
      )}
      {isReviewModal && (
        <WriteReviewModal
          isOpen={isReviewModal}
          onClose={() => setIsReviewModal(false)}
          reviewData={reviewData}
          orderId={item.order_id}
          goodsId={item.product_id}
          mode={getReviewMode()}
          productName={item.product_name}
          productImage={item.product_image}
          productOption={`색상 ${item.color} / 사이즈 ${item.size}`}
        />
      )}
    </li>
  );
};

export default DetailOrderItem;
