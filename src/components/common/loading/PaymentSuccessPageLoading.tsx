import PaymentSuccessLoading from "./PaymentSuccessLoading";

// Suspense fallback — 결제 처리 중 화면과 동일한 표시를 사용
const PaymentSuccessPageLoading = () => {
  return <PaymentSuccessLoading />;
};

export default PaymentSuccessPageLoading;
