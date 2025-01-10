import { Suspense } from "react";
import PaymentFail from "@/components/payment/fail/PaymentFail";
import PaymentFailLoading from "@/components/common/loading/PaymentFailLoading";
import AuthGuard from "@/hooks/AuthGuard";

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
