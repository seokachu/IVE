"use client";
import SelectionControl from "@/components/common/select/SelectionControl";
import {
  useDeleteAllOrderItems,
  useDeleteOrderItems,
  useOrderItems,
} from "@/hooks/queries/useOrderItems";
import { toast } from "@/hooks/use-toast";
import { sessionState } from "@/store";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import _ from "lodash";
import OrderDetail from "@/components/mypage/order/OrderDetail";
import OrderSummary from "@/components/mypage/order/OrderSummary";
import { getDiscountedPrice } from "@/utils/calculateDiscount";

const OrderListPage = () => {
  const session = useRecoilValue(sessionState);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { mutate: deleteItems } = useDeleteOrderItems();
  const { mutate: deleteAllItems } = useDeleteAllOrderItems();
  const { data: orderItems, isLoading } = useOrderItems(session?.user?.id);

  //로그인 권한분기 예정(임시)
  if (!session) {
    return <div>로그인이 필요한 페이지 입니다.</div>;
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && orderItems) {
      setSelectedItems(orderItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  if (isLoading) return <div>로딩중</div>;

  const isEmpty = !orderItems || orderItems.length === 0;

  //주문목록 id별로 그룹화
  const groupedOrders = _.groupBy(orderItems, "order_id");

  //주문 요약 정보 뽑아내기
  const orderSummaries = Object.entries(groupedOrders).map(
    ([orderId, items]) => ({
      orderId,
      totalAmount: _.sumBy(
        items,
        (item) => getDiscountedPrice(item) * item.quantity
      ),
      itemCount: _.sumBy(items, "quantity"),
      orderDate: items[0]?.created_at,
      firstItemName: items[0]?.product_name,
      firstOrderImage: items[0]?.product_image,
      // disCountRate:
    })
  );

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택한 내용이 없습니다.",
        variant: "destructive",
      });
      return;
    }

    deleteItems(selectedItems, {
      onSuccess: () => {
        toast({ title: "선택한 항목이 삭제 되었습니다." });
        setSelectedItems([]);
      },
      onError: () => {
        toast({
          title: "삭제 중 오류가 발생했습니다.",
          description: "다시 시도해 주세요.",
        });
      },
    });
  };

  const handleConfirmDeleteAll = () => {
    if (!session.user.id) return;

    deleteAllItems(session.user.id, {
      onSuccess: () => {
        toast({
          title: "모든 항목이 삭제되었습니다.",
        });
        setSelectedItems([]);
      },
      onError: () => {
        toast({
          title: "삭제 중 오류가 발생했습니다.",
          description: "다시 시도해 주세요.",
        });
      },
    });
  };

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      {!isEmpty && !selectedOrderId && (
        <>
          <div className="flex justify-between items-center mt-5 lg:mt-0">
            <h2 className="font-bold text-xl mb-5 hidden lg:block">
              결제 목록
            </h2>
          </div>
          <SelectionControl
            totalItems={orderItems.length}
            selectedCount={selectedItems.length}
            onSelectAll={handleSelectAll}
            onDeleteSelected={handleDeleteSelected}
            onConfirm={handleConfirmDeleteAll}
            title="결제목록 비우기"
            description="결제한 목록이 삭제됩니다. 정말 삭제하시겠습니까?"
            cancelText="취소"
            confirmText="삭제"
          />
        </>
      )}
      {isEmpty ? (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[500px]">
          <h3>결제한 목록이 없습니다.</h3>
        </div>
      ) : !selectedOrderId ? (
        <ul className="space-y-4 mt-5">
          {orderSummaries.map((order) => (
            <OrderSummary
              key={order.orderId}
              order={order}
              onViewDetail={() => setSelectedOrderId(order.orderId)}
            />
          ))}
        </ul>
      ) : (
        <OrderDetail
          orderItems={groupedOrders[selectedOrderId]}
          onBack={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default OrderListPage;
