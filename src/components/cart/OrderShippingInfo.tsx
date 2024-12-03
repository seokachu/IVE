import { useRouter } from "next/navigation";
import ActionButton from "../common/button/ActionButton";

const OrderShippingInfo = () => {
  const { push } = useRouter();

  const handleShippingAddressChange = () => {
    push("/mypage/address");
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between border-b pb-4 mb-5">
        <h2 className="font-bold">배송 정보</h2>
        <ActionButton
          onClick={handleShippingAddressChange}
          variant="primary"
          className="text-xs px-2"
        >
          배송지 변경
        </ActionButton>
      </div>
      <ul className="flex flex-col justify-between gap-2 text-sm">
        <li className="flex">
          <h3 className="w-[100px] text-gray-400">받는 분</h3>
          <p>홍길동</p>
        </li>
        <li className="flex">
          <h3 className="w-[100px] text-gray-400">휴대폰 번호</h3>
          <p>010-0000-0000</p>
        </li>
        <li className="flex">
          <h3 className="w-[100px] text-gray-400">배송지 정보</h3>
          <div>
            <p>도로명 : 경기 성남시 분당구 판교역로 111</p>
            <p>지번 : 경기 성남시 분당구 판교역로 111</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OrderShippingInfo;
