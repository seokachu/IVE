import { Suspense } from "react";
import PaymentSuccessPageLoading from "@/components/common/loading/PaymentSuccessPageLoading";
import PaymentSuccess from "@/components/payment/success/PaymentSuccess";
import AuthGuard from "@/hooks/AuthGuard";

const page = () => {
  return (
    <AuthGuard>
      <Suspense fallback={<PaymentSuccessPageLoading />}>
        <PaymentSuccess />
      </Suspense>
    </AuthGuard>
  );
};

export default page;
