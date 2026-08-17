"use client";
import { MapPin } from "lucide-react";
import AddressAddButton from "@/components/mypage/address/AddressAddButton";
import { useShippingAddresses } from "@/hooks/queries/useShippingAddress";
import AddressList from "@/components/mypage/address/AddressList";
import MyPageEmptyState from "@/components/mypage/MyPageEmptyState";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import { useSession } from "@/store/zustand";

const AddressManagementPage = () => {
  const session = useSession();
  const { data: addresses, isLoading, isSuccess } = useShippingAddresses(session?.user?.id);

  if (isLoading || !isSuccess) return <MyPageLoading title="배송지 관리" />;

  const isEmpty = !addresses || addresses.length === 0;

  return (
    <div>
      <MyPageTitle title="배송지 관리" count={addresses?.length ?? 0}>
        {!isEmpty && <AddressAddButton />}
      </MyPageTitle>
      {isEmpty ? (
        <MyPageEmptyState icon={MapPin} title="등록된 배송지가 없습니다" description="배송지를 등록하면 주문이 빨라져요">
          <AddressAddButton />
        </MyPageEmptyState>
      ) : (
        <AddressList addresses={addresses} />
      )}
    </div>
  );
};

export default AddressManagementPage;
