"use client";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import { useRouter } from "next/navigation";
import _ from "lodash";
import OrderDetail from "@/components/mypage/order/OrderDetail";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import type { OrderDetailPageProps } from "@/types/mypage";

const OrderDetailPage = ({ params: { orderId } }: OrderDetailPageProps) => {
  const router = useRouter();
  const session = useRecoilValue(sessionState);
  const { data: orderItems, isLoading } = useOrderItems(session?.user?.id);

  if (isLoading) return <MyPageLoading />;

  const groupedOrders = _.groupBy(orderItems, "order_id");
  const currentOrderItems = groupedOrders[orderId];

  if (!currentOrderItems) return <div>주문을 찾을 수 없습니다.</div>;

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <OrderDetail orderItems={currentOrderItems} onBack={() => router.back()} />
    </div>
  );
};

export default OrderDetailPage;
