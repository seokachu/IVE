import type { PaymentDetailsProps } from "@/types/mypage";

const RecipientInfo = ({ item }: PaymentDetailsProps) => {
  return (
    <>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">받는 분</span>
        <span>{item?.recipient_name}</span>
      </li>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">휴대폰 번호</span>
        <span>{item?.recipient_phone}</span>
      </li>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">배송지 정보</span>
        <span className="min-w-0 leading-relaxed">
          ({item?.postal_code}) {item?.address_line1}
          {item?.address_line2}
        </span>
      </li>
    </>
  );
};

export default RecipientInfo;
