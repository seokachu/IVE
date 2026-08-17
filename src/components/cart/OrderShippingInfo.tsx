import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";
import EmptyStateMessage from "./EmptyStateMessage";
import ShippingAddressPicker from "./ShippingAddressPicker";
import { useSession } from "@/store/zustand";

const OrderShippingInfo = () => {
  const { push } = useRouter();
  const session = useSession();
  const { data: shippingAddress } = useShippingAddress(session?.user.id);
  const [isPicking, setIsPicking] = useState(false);

  if (!session) {
    return <EmptyStateMessage title="배송 정보" message="배송 정보가 없습니다." />;
  }

  const hasShippingAddress = shippingAddress && Object.keys(shippingAddress).length > 0;

  //배송지 없으면 추가 페이지로, 있으면 인라인 배송지 선택 토글
  const handleShippingAddressChange = () => {
    if (hasShippingAddress) {
      setIsPicking(!isPicking);
    } else {
      push("/mypage/address/new");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold">배송 정보</h2>
        <Button
          variant="plain"
          size="auto"
          onClick={handleShippingAddressChange}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500 hover:bg-gray-50"
        >
          {hasShippingAddress ? (isPicking ? "접기" : "변경") : "배송지 추가"}
        </Button>
      </div>
      {isPicking ? (
        <ShippingAddressPicker userId={session.user.id} />
      ) : !hasShippingAddress ? (
        <div className="my-7 flex flex-col items-center gap-1 text-sm">
          <h3>배송 정보가 없습니다.</h3>
          <p className="text-[13px] text-gray-400">배송지를 추가해 주세요.</p>
        </div>
      ) : (
        <ul className="mt-3.5 flex flex-col gap-2 text-[13px]">
          <li className="flex">
            <h3 className="w-[80px] shrink-0 text-gray-400">받는 분</h3>
            <p>{shippingAddress?.recipient_name}</p>
          </li>
          <li className="flex">
            <h3 className="w-[80px] shrink-0 text-gray-400">휴대폰 번호</h3>
            <p>{shippingAddress?.recipient_phone}</p>
          </li>
          <li className="flex">
            <h3 className="w-[80px] shrink-0 text-gray-400">배송지 정보</h3>
            <div className="min-w-0 leading-relaxed">
              <span className="mr-1">({shippingAddress?.postal_code})</span>
              <span className="mr-1">{shippingAddress?.address_line1}</span>
              <span>{shippingAddress?.address_line2}</span>
            </div>
          </li>
          {shippingAddress?.request && (
            <li className="flex">
              <h3 className="w-[80px] shrink-0 text-gray-400">요청사항</h3>
              <p className="min-w-0">{shippingAddress.request}</p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default OrderShippingInfo;
