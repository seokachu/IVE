import type { PaymentDetailsProps } from "@/types";

const RecipientInfo = ({ item }: PaymentDetailsProps) => {
  return (
    <>
      <li>
        <span className="flex-shrink-0 text-gray-500 mr-2">받는 분 :</span>
        <span>{item?.recipient_name}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="text-gray-500">휴대폰 번호 :</span>
        <span>{item?.recipient_phone}</span>
      </li>
      <li className="flex items-stretch gap-2">
        <span className="flex-shrink-0 text-gray-500">배송지 정보 :</span>
        <span>
          &#91;{item?.postal_code}&#93; {item?.address_line1}
          {item?.address_line2}
        </span>
      </li>
    </>
  );
};

export default RecipientInfo;
