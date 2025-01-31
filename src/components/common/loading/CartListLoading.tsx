import { ClipLoader } from "react-spinners";

const CartListLoading = () => {
  return (
    <div className="flex-[2] p-5 lg:p-10 border rounded-md bg-white shadow-sm min-h-[500px] h-fit">
      <h2 className="font-bold text-lg lg:text-xl">장바구니</h2>
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <ClipLoader />
      </div>
    </div>
  );
};

export default CartListLoading;
