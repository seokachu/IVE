import RecipientInfo from "./RecipientInfo";
import OrderPaymentInfo from "./OrderPaymentInfo";
import OrderPaymentDetails from "./OrderPaymentDetails";
import type { PaymentOverviewProps } from "@/types/mypage";

const PaymentOverview = ({ title, payment }: PaymentOverviewProps) => {
  const getComponent = (title: string) => {
    switch (title) {
      case "배송 정보":
        return RecipientInfo;
      case "결제 정보":
        return OrderPaymentInfo;
      case "결제 수단":
        return OrderPaymentDetails;
      default:
        return null;
    }
  };

  const SelectedComponent = getComponent(title);

  return (
    <div className="flex-1 border border-gray-200 rounded-lg px-4 py-5">
      <h3 className="font-bold mb-4 border-b pb-2">{title}</h3>
      <ul className="space-y-2 text-sm">{SelectedComponent && <SelectedComponent item={payment} />}</ul>
    </div>
  );
};

export default PaymentOverview;
