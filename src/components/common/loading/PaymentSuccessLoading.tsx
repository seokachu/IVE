const PaymentSuccessLoading = () => {
  return (
    <div className="min-h-screen sm:min-h-[250px] md:min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h2>결제 정보를 처리하고 있습니다...</h2>
        <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default PaymentSuccessLoading;
