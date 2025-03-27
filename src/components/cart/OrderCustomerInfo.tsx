import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import { useCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import ActionButton from "../common/button/ActionButton";
import { useState } from "react";
import CustomerInfoForm from "./CustomerInfoForm";
import EmptyStateMessage from "./EmptyStateMessage";
import OrderCustomerInfoItem from "./OrderCustomerInfoItem";

const OrderCustomerInfo = () => {
  const session = useRecoilValue(sessionState);
  const { data: customerInfo } = useCustomerInfo(session?.user.id);
  const [isEditing, setIsEditing] = useState(false);

  if (!session) {
    return <EmptyStateMessage title="주문자 정보" message="주문자 정보가 없습니다." />;
  }

  // 주문자 정보 입력 & 수정 form
  if (isEditing) {
    return (
      <CustomerInfoForm
        initialData={customerInfo}
        defaultValues={{
          name: session.user.user_metadata?.name,
          email: session.user.email,
        }}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between border-b pb-4 mb-5">
        <h2 className="font-bold">주문자 정보</h2>
        <ActionButton variant="primary" className="text-xs px-2" onClick={() => setIsEditing(true)}>
          {customerInfo ? "정보 변경" : "정보 입력"}
        </ActionButton>
      </div>
      <ul className="flex flex-col justify-between gap-2 text-sm">
        {!customerInfo ? (
          <li className="flex items-center justify-center flex-col gap-1 my-8">
            <h3>주문자 정보가 없습니다.</h3>
            <p>주문자 정보를 입력해주세요.</p>
          </li>
        ) : (
          <>
            <OrderCustomerInfoItem item={customerInfo} />
          </>
        )}
      </ul>
    </div>
  );
};

export default OrderCustomerInfo;
