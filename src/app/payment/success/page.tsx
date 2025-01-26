import { Suspense } from "react";
import PaymentSuccessPageLoading from "@/components/common/loading/PaymentSuccessPageLoading";
import PaymentSuccess from "@/components/payment/success/PaymentSuccess";
import AuthGuard from "@/hooks/AuthGuard";
import { paymentMetadata } from "@/metadata/payment/paymentMetadata";

export const metadata = paymentMetadata;

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
