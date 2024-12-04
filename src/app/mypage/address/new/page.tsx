"use client";
import AddressForm from "@/components/mypage/address/AddressForm";

const page = () => {
  return (
    <div className="px-5 pt-10 pb-28 lg:pt-14 lg:px-8 flex flex-col justify-center items-center">
      <h2 className="font-bold text-xl mb-10">배송정보</h2>
      <AddressForm />
    </div>
  );
};

export default page;
