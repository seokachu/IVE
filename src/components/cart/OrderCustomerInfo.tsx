import ActionButton from "../common/button/ActionButton";

const OrderCustomerInfo = () => {
  return (
    <div className="mb-12">
      <div className="flex justify-between border-b pb-4 mb-5">
        <h2 className="font-bold">주문자 정보</h2>
        <ActionButton variant="primary" className="text-xs px-2">
          정보 변경
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
          <h3 className="w-[100px] text-gray-400">이메일 주소</h3>
          <p>seokachuu@naver.com</p>
        </li>
      </ul>
    </div>
  );
};

export default OrderCustomerInfo;
