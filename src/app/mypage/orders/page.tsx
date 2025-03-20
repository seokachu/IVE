'use client';
import { useOrderItems } from '@/hooks/queries/useOrderItems';
import { sessionState } from '@/store';
import { useRecoilValue } from 'recoil';
import _ from 'lodash';
import OrderSummary from '@/components/mypage/order/OrderSummary';
import { getDiscountedPrice } from '@/utils/calculateDiscount';
import MyPageLoading from '@/components/common/loading/MyPageLoading';

const OrderListPage = () => {
  const session = useRecoilValue(sessionState);
  const { data: orderItems, isLoading, isSuccess } = useOrderItems(session?.user?.id);

  if (isLoading || !isSuccess) {
    return <MyPageLoading title="결제 목록" />;
  }

  const isEmpty = !orderItems || orderItems.length === 0;

  //주문목록 id별로 그룹화
  const groupedOrders = _.groupBy(orderItems, 'order_id');

  //주문 요약 정보 뽑아내기
  const orderSummaries = Object.entries(groupedOrders).map(([orderId, items]) => ({
    orderId,
    totalAmount: _.sumBy(items, (item) => getDiscountedPrice(item) * item.quantity),
    itemCount: _.sumBy(items, 'quantity'),
    orderDate: items[0]?.created_at,
    firstItemName: items[0]?.product_name,
    firstOrderImage: items[0]?.product_image,
  }));

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:pl-8 lg:pr-5">
      {!isEmpty && (
        <div className="flex justify-between items-center mt-5 lg:mt-0">
          <h2 className="font-bold text-xl mb-5 hidden lg:block">결제 목록</h2>
        </div>
      )}
      {isEmpty ? (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[250px] lg:h-[500px]">
          <h3>결제한 목록이 없습니다.</h3>
        </div>
      ) : (
        <ul className="space-y-4 mt-5">
          {orderSummaries.map((order) => (
            <OrderSummary key={order.orderId} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderListPage;
