import Image from "next/image";
import { useState } from "react";
import ActionButton from "@/components/common/button/ActionButton";
import { formatPrice } from "@/utils/calculateDiscount";
import { formatDate } from "@/utils/formatDate";
import type { OrderSummaryProps } from "@/types";
import ConfirmModal from "@/components/common/modal/ConfirmModal";

const OrderSummary = ({ order, onViewDetail }: OrderSummaryProps) => {
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const onClickCompleteOrder = () => {
    setIsModal(true);
  };

  const handleWriteReview = () => {
    setIsReviewMode(true);
  };

  const goToWriteReview = () => {
    
  };

  return (
    <li className="border rounded-sm py-4 px-6 hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="relative overflow-hidden rounded-md w-[80px] h-[80px]">
            <Image
              src={order.firstOrderImage}
              alt={order.firstItemName}
              width={500}
              height={500}
              className="object-cover border"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">주문번호 : {order.orderId}</p>
            <p className="font-bold my-1">
              {order.firstItemName}
              {order.itemCount > 1 ? ` 외 ${order.itemCount - 1}건` : ""}
            </p>
            <p className="text-sm text-gray-500">총 수량 : {order.itemCount}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
          <p className="font-bold my-1">{formatPrice(order.totalAmount)}원</p>
          <div className="flex gap-2 items-baseline">
            <ActionButton
              onClick={onClickCompleteOrder}
              variant="primary"
              className="text-sm py-1 px-3"
            >
              {!isReviewMode ? "구매확정" : "후기작성"}
            </ActionButton>
            <ActionButton
              variant="default"
              onClick={onViewDetail}
              className="mt-2 text-sm py-1 px-3"
            >
              상세보기
            </ActionButton>
          </div>
        </div>
      </div>
      {isModal && (
        <ConfirmModal
          isOpen={setIsModal}
          onConfirm={handleWriteReview}
          title="구매확정"
          description="정말로 구매를 확정하시겠습니까?"
          cancelText="취소"
          confirmText="구매확정"
        />
      )}
    </li>
  );
};

export default OrderSummary;
