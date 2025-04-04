import ActionButton from "@/components/common/button/ActionButton";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { toast } from "@/hooks/use-toast";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import WriteReviewModal from "./WriteReviewModal";
import { useOrderItemReview } from "@/hooks/queries/useReviews";
import { useRouter } from "next/navigation";
import type { DetailOrderItemProps } from "@/types/mypage";

const DetailOrderItem = ({ item, onConfirm }: DetailOrderItemProps) => {
  const { push } = useRouter();
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isReviewModal, setIsReviewModal] = useState(false);
  const { data: reviewData } = useOrderItemReview(item.order_id, item.product_id);
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

  //모달 mode
  const getReviewMode = () => {
    return reviewData ? "edit" : "create";
  };

  const onClickDetail = () => {
    push(`/shop/${item.product_id}`);
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
        <div onClick={onClickDetail} className="cursor-pointer flex gap-4">
          {item.product_image && (
            <div className="relative overflow-hidden border rounded-md w-[80px] h-[80px]">
              <Image
                src={item.product_image}
                alt={item.product_name}
                className="object-cover"
                width={500}
                height={500}
              />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h3 className="text-sm lg:text-base font-bold">{item.product_name}</h3>
            <div className="text-gray-500 text-xs lg:text-sm flex lg:items-center flex-col lg:flex-row gap-[2px] lg:gap-1 mt-1 uppercase">
              <p>색상 : {item.color}</p>
              <span className="hidden lg:block">&#47;</span>
              <p>사이즈 : {item.size}</p>
              <span className="hidden lg:block -translate-y-[1px] text-dark-gray">|</span>
              <p>수량 : {item.quantity}개</p>
            </div>
            <div className="flex gap-2 items-baseline">
              <s className="text-sm text-dark-gray">{formatPrice(item.price * item.quantity)}</s>
              <strong className="text-sm lg:text-base">{formatPrice(price)}원</strong>
            </div>
          </div>
        </div>
        <ActionButton
          onClick={item.is_confirmed ? onClickWriteReview : onClickCompleteOrder}
          variant={item.is_confirmed ? "primary" : "default"}
          className="text-sm py-2 px-3 mt-5 lg:mt-0"
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
          mode={getReviewMode()}
        />
      )}
    </li>
  );
};

export default DetailOrderItem;
