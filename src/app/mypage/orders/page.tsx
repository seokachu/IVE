"use client";
import SelectionControl from "@/components/common/select/SelectionControl";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import { toast } from "@/hooks/use-toast";
import { sessionState } from "@/store";
import { useState } from "react";
import { useRecoilValue } from "recoil";

const OrderListPage = () => {
  const session = useRecoilValue(sessionState);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { data: orderItems, isLoading } = useOrderItems(session?.user.id);
  console.log(orderItems);

  //전체 선택
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(orderItems?.map((item) => item.id || []));
    } else {
      setSelectedItems([]);
    }
  };

  //선택 삭제 핸들러
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택한 내용이 없습니다.",
        variant: "destructive",
      });
      return;
    }
  };

  //전체삭제 확인 핸들러
  const handleConfirmDeleteAll = () => {};

  if (isLoading) return <div>로딩중</div>;

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">결제 목록</h2>
      </div>
      <SelectionControl
        totalItems={cartItems.length}
        selectedCount={selectedItems.length}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelected}
        onConfirm={handleConfirmDeleteAll}
        title="결제목록 비우기"
        description="결제한 목록이 삭제됩니다. 정말 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
      />
      {/* {!isEmpty ? (
        <AddressList addresses={addresses} />
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[500px]">
          <h3>결제한 목록이 없습니다.</h3>
        </div>
      )} */}
    </div>
  );
};

export default OrderListPage;
