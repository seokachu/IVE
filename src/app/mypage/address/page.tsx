"use client";
import AddressAddButton from "@/components/mypage/AddressAddButton";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";

const AddressManagementPage = () => {
  const session = useRecoilValue(sessionState);

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <h2 className="font-bold text-xl mb-5 hidden lg:block">배송지 관리</h2>
      {!session ? (
        <div>
          배송정보
          {/* <ActionButton
            variant="default"
            className="flex items-center justify-center gap-1 border py-2 px-5 rounded-md"
          >
            <HiPlusSmall size={20} className="translate-y-[1px]" />새 배송지
            추가
          </ActionButton> */}
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[500px]">
          <h3>배송지가 없습니다.</h3>
          <AddressAddButton />
        </div>
      )}
    </div>
  );
};

export default AddressManagementPage;
