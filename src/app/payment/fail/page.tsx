import { Suspense } from "react";
import PaymentFail from "@/components/payment/fail/PaymentFail";
import PaymentFailLoading from "@/components/common/loading/PaymentFailLoading";
import AuthGuard from "@/hooks/AuthGuard";
import { paymentMetadata } from "@/metadata/payment/paymentMetadata";

export const metadata = paymentMetadata;

const page = () => {
  return (
    <AuthGuard>
      <Suspense fallback={<PaymentFailLoading />}>
        <PaymentFail />
      </Suspense>
    </AuthGuard>
  );
};

export default page;
