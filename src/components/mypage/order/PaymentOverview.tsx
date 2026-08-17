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
    <div className="flex-1 rounded-2xl border border-gray-200 bg-card p-6">
      <h3 className="text-[15px] font-bold">{title}</h3>
      <ul className="mt-3.5 space-y-2 text-[13px]">{SelectedComponent && <SelectedComponent item={payment} />}</ul>
    </div>
  );
};

export default PaymentOverview;
