import type { OrderCustomerInfoItemProps } from "@/types/cart";

const OrderCustomerInfoItem = ({ item }: OrderCustomerInfoItemProps) => {
  return (
    <>
      <li className="flex">
        <h3 className="w-[100px] text-gray-400">받는 분</h3>
        <p>{item?.name}</p>
      </li>
      <li className="flex">
        <h3 className="w-[100px] text-gray-400">휴대폰 번호</h3>
        <p>{item?.phone}</p>
      </li>
      <li className="flex">
        <h3 className="w-[100px] text-gray-400">이메일 주소</h3>
        <p>{item?.email}</p>
      </li>
    </>
  );
};

export default OrderCustomerInfoItem;
