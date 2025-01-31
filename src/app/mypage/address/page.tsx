"use client";

import AddressAddButton from "@/components/mypage/address/AddressAddButton";
import { useShippingAddresses } from "@/hooks/queries/useShippingAddress";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import AddressList from "@/components/mypage/address/AddressList";
import MyPageLoading from "@/components/common/loading/MyPageLoading";

const AddressManagementPage = () => {
  const session = useRecoilValue(sessionState);
  const {
    data: addresses,
    isLoading,
    isSuccess,
  } = useShippingAddresses(session?.user?.id);

  if (isLoading || !isSuccess) return <MyPageLoading title="배송지 관리" />;

  const isEmpty = !addresses || addresses.length === 0;

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:pl-8 lg:pr-5">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">배송지 관리</h2>
        {!isEmpty && <AddressAddButton />}
      </div>
      {!isEmpty ? (
        <AddressList addresses={addresses} />
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[250px] lg:h-[500px]">
          <h3>배송지가 없습니다.</h3>
          <AddressAddButton />
        </div>
      )}
    </div>
  );
};

export default AddressManagementPage;
