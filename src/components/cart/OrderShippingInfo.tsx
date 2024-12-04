import { useRouter } from "next/navigation";
import ActionButton from "../common/button/ActionButton";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";

const OrderShippingInfo = () => {
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const { data } = useShippingAddress(session?.user.id);

  const hasShippingAddress = data && Object.keys(data).length > 0;

  const handleShippingAddressChange = () => {
    push("/mypage/address");
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between border-b pb-4 mb-5">
        <h2 className="font-bold">배송 정보</h2>
        {session && (
          <ActionButton
            onClick={handleShippingAddressChange}
            variant="primary"
            className="text-xs px-2"
          >
            {hasShippingAddress ? "배송지 변경" : "배송지 추가"}
          </ActionButton>
        )}
      </div>
      <ul className="flex flex-col justify-between gap-2 text-sm">
        {!session || !hasShippingAddress ? (
          <li className="flex items-center justify-center flex-col gap-1 my-8">
            <h3>배송 정보가 없습니다.</h3>
            <p>배송지를 추가해 주세요.</p>
          </li>
        ) : (
          <>
            <li className="flex">
              <h3 className="w-[100px] text-gray-400">받는 분</h3>
              <p className="flex-shrink-0">{data?.recipient_name}</p>
            </li>
            <li className="flex">
              <h3 className="w-[100px] flex-shrink-0 text-gray-400">
                휴대폰 번호
              </h3>
              <p>{data?.recipient_phone}</p>
            </li>
            <li className="flex">
              <h3 className="w-[100px] flex-shrink-0 text-gray-400">
                배송지 정보
              </h3>
              <div>
                <span className="mr-1">{data?.postal_code}</span>
                <span className="mr-1">{data?.address_line1}</span>
                <span>{data?.address_line2}</span>
              </div>
            </li>
            {data?.request && (
              <li className="flex">
                <h3 className="w-[100px] flex-shrink-0 text-gray-400">
                  요청사항
                </h3>
                {data.request}
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default OrderShippingInfo;
