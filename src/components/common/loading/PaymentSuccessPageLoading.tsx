import { ClipLoader } from "react-spinners";

const PaymentSuccessPageLoading = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h2 className="mb-5 font-bold">Loading...</h2>
      <ClipLoader />
    </div>
  );
};

export default PaymentSuccessPageLoading;
