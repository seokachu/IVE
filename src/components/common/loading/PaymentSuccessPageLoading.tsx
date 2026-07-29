import Spinner from "@/components/common/Spinner";

const PaymentSuccessPageLoading = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col sm:-mt-20 md:mt-0">
      <h2 className="mb-5 font-bold">Loading...</h2>
      <Spinner />
    </div>
  );
};

export default PaymentSuccessPageLoading;
