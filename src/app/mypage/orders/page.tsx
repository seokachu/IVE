"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import _ from "lodash";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import { usePaymentSummaries } from "@/hooks/queries/usePayment";
import { useSession } from "@/store/zustand";
import OrderSummary from "@/components/mypage/order/OrderSummary";
import MyPageEmptyState from "@/components/mypage/MyPageEmptyState";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import MyPageLoading from "@/components/common/loading/MyPageLoading";

const OrderListPage = () => {
  const session = useSession();
  const { data: orderItems, isLoading, isSuccess } = useOrderItems(session?.user?.id);
  const { data: paymentSummaries } = usePaymentSummaries((orderItems || []).map((item) => item.order_id));

  if (isLoading || !isSuccess) {
    return <MyPageLoading title="결제 내역" />;
  }

  const isEmpty = !orderItems || orderItems.length === 0;

  //주문목록 id별로 그룹화
  const groupedOrders = _.groupBy(orderItems, "order_id");

  //주문 요약 정보 뽑아내기 — 금액은 실제 결제액(멤버십 할인 반영) 우선, 없으면 상품 합계 폴백
  const orderSummaries = Object.entries(groupedOrders).map(([orderId, items]) => ({
    orderId,
    totalAmount: paymentSummaries?.[orderId]?.amount ?? _.sumBy(items, (item) => getDiscountedPrice(item) * item.quantity),
    itemCount: _.sumBy(items, "quantity"),
    orderDate: items[0]?.created_at,
    firstItemName: items[0]?.product_name,
    firstOrderImage: items[0]?.product_image,
    isAllConfirmed: items.every((item) => item.is_confirmed),
    deliveryStatus: paymentSummaries?.[orderId]?.deliveryStatus ?? null,
  }));

  return (
    <div>
      <MyPageTitle title="결제 내역" count={orderSummaries.length} />
      {isEmpty ? (
        <MyPageEmptyState icon={ShoppingBag} title="결제한 내역이 없습니다" description="첫 주문을 기다리고 있어요">
          <Link
            href="/shop"
            className="inline-flex h-10 items-center rounded-full bg-purple-300 px-5 text-[13px] font-bold text-white transition-colors hover:bg-purple-400"
          >
            굿즈샵 구경 가기
          </Link>
        </MyPageEmptyState>
      ) : (
        <ul className="space-y-4">
          {orderSummaries.map((order) => (
            <OrderSummary key={order.orderId} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderListPage;
