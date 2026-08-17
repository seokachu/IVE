import { useCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CustomerInfoForm from "./CustomerInfoForm";
import EmptyStateMessage from "./EmptyStateMessage";
import OrderCustomerInfoItem from "./OrderCustomerInfoItem";
import { useSession } from "@/store/zustand";

const OrderCustomerInfo = () => {
  const session = useSession();
  const { data: customerInfo } = useCustomerInfo(session?.user.id);
  const [isEditing, setIsEditing] = useState(false);

  if (!session) {
    return <EmptyStateMessage title="주문자 정보" message="주문자 정보가 없습니다." />;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold">주문자 정보</h2>
        {!isEditing && (
          <Button
            variant="plain"
            size="auto"
            className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50"
            onClick={() => setIsEditing(true)}
          >
            {customerInfo ? "변경" : "입력"}
          </Button>
        )}
      </div>
      {isEditing ? (
        // 주문자 정보 입력 & 수정 인라인 폼
        <CustomerInfoForm
          initialData={customerInfo}
          defaultValues={{
            name: session.user.user_metadata?.name,
            email: session.user.email,
          }}
          onSuccess={() => setIsEditing(false)}
        />
      ) : !customerInfo ? (
        <div className="my-7 flex flex-col items-center gap-1 text-sm">
          <h3>주문자 정보가 없습니다.</h3>
          <p className="text-[13px] text-gray-400">주문자 정보를 입력해주세요.</p>
        </div>
      ) : (
        <ul className="mt-3.5 flex flex-col gap-2 text-[13px]">
          <OrderCustomerInfoItem item={customerInfo} />
        </ul>
      )}
    </div>
  );
};

export default OrderCustomerInfo;
