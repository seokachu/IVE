import { ClipLoader } from "react-spinners";

const CartListLoading = () => {
  return (
    <div className="flex-[2] p-10 border rounded-md bg-white shadow-sm min-h-[500px]">
      <h2 className="font-bold text-xl">장바구니</h2>
      <div className="w-full h-full flex items-center justify-center">
        <ClipLoader />
      </div>
    </div>
  );
};

export default CartListLoading;
