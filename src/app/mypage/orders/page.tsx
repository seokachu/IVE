"use client";
import SelectionControl from "@/components/common/select/SelectionControl";
import OrderListItem from "@/components/mypage/order/OrderListItem";
import {
  useDeleteAllOrderItems,
  useDeleteOrderItems,
  useOrderItems,
} from "@/hooks/queries/useOrderItems";
import { toast } from "@/hooks/use-toast";
import { sessionState } from "@/store";
import { useState } from "react";
import { useRecoilValue } from "recoil";

const OrderListPage = () => {
  const session = useRecoilValue(sessionState);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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

  const isEmpty = !orderItems || orderItems.length === 0;
  if (isLoading) return <div>로딩중</div>;

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

  console.log("orderItems", orderItems);

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">결제 목록</h2>
      </div>
      {!isEmpty && (
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
      )}
      {isEmpty ? (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[500px]">
          <h3>결제한 목록이 없습니다.</h3>
        </div>
      ) : (
        <ul>
          {orderItems.map((item) => (
            <OrderListItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderListPage;
