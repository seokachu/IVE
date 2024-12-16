import ActionButton from "@/components/common/button/ActionButton";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { toast } from "@/hooks/use-toast";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import WriteReviewModal from "./WriteReviewModal";
import { useOrderItemReview } from "@/hooks/queries/useReviews";
import type { DetailOrderItemProps } from "@/types";

const DetailOrderItem = ({ item, onConfirm }: DetailOrderItemProps) => {
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const { data: reviewData } = useOrderItemReview(item.order_id);

  const price = getDiscountedPrice(item);

  const onClickCompleteOrder = () => {
    setIsConfirmModal(true);
  };

  const handleConfirmOrder = () => {
    onConfirm();
    toast({
      title: "구매가 확정되었습니다.",
      description: item.product_name,
    });
  };

  const onClickWriteReview = () => {
    setIsReviewModal(true);
  };

  //구매확정 상태이고 리뷰가 있으면 리뷰수정, 없으면 리뷰쓰기
  const getButtonText = () => {
    if (!item.is_confirmed) return "구매확정";
    return reviewData ? "리뷰수정" : "리뷰쓰기";
  };

  return (
    <li className="border rounded-lg p-4">
      {item.is_confirmed && (
        <p className="text-sm text-green-500 flex items-center gap-1 mb-2 border-b py-2">
          <FaCheck />
          <span>구매확정</span>
        </p>
      )}
      <div className="flex flex-col lg:flex-row lg:justify-between py-2">
        <div className="flex gap-4">
          {item.product_image && (
            <div className="relative overflow-hidden rounded-md w-[80px] h-[80px]">
              <Image
                src={item.product_image}
                alt={item.product_name}
                className="object-cover border"
                width={500}
                height={500}
              />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h3 className="font-bold">{item.product_name}</h3>
            <div className="text-gray-500 text-sm flex items-center gap-1 mt-1 uppercase">
              <p>색상 : {item.color}</p>&#47;
              <p>사이즈 : {item.size}</p>
              <span className="-translate-y-[1px] text-dark-gray">|</span>
              <p>수량 : {item.quantity}개</p>
            </div>
            <div className="flex gap-2 items-center">
              <s className="text-sm text-dark-gray">
                {formatPrice(item.price * item.quantity)}
              </s>
              <strong>{formatPrice(price)}원</strong>
            </div>
          </div>
        </div>
        <ActionButton
          onClick={
            item.is_confirmed ? onClickWriteReview : onClickCompleteOrder
          }
          variant={item.is_confirmed ? "primary" : "default"}
          className="text-sm py-1 px-3 mt-5 lg:mt-0"
        >
          {getButtonText()}
        </ActionButton>
      </div>
      {isConfirmModal && (
        <ConfirmModal
          isOpen={setIsConfirmModal}
          onConfirm={handleConfirmOrder}
          title="구매확정"
          description="구매를 확정하시겠습니까? 구매 확정 후에는 취소나 변경이 불가능합니다."
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
        />
      )}
    </li>
  );
};

export default DetailOrderItem;
