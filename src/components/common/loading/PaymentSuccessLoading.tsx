const PaymentSuccessLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div>결제 정보를 처리하고 있습니다...</div>
        <div className="text-sm text-gray-500">잠시만 기다려주세요.</div>
      </div>
    </div>
  );
};

export default PaymentSuccessLoading;
