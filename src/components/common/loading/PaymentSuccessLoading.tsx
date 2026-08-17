import { Info } from "lucide-react";
import Spinner from "@/components/common/Spinner";

// 결제 승인 확인 중 화면 — 시안: "결제 처리 중"
const PaymentSuccessLoading = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 sm:-mt-20 md:mt-0">
      <Spinner size={52} />
      <h2 className="mt-7 text-xl font-bold lg:text-[22px]">결제 정보를 처리하고 있어요</h2>
      <p className="mt-2.5 text-[15px] text-gray-500">잠시만 기다려 주세요. 결제 승인을 확인하는 중이에요.</p>
      <p className="mt-6 flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-xs text-gray-400">
        <Info size={13} aria-hidden />
        결제가 끝날 때까지 창을 닫지 말아 주세요
      </p>
    </div>
  );
};

export default PaymentSuccessLoading;
