import { useRouter } from "next/navigation";
import ActionButton from "../../common/button/ActionButton";
import { HiPlusSmall } from "react-icons/hi2";

const AddressAddButton = () => {
  const { push } = useRouter();
  const onClickAddAddress = () => {
    push("/mypage/address/new");
  };

  return (
    <>
      <ActionButton
        onClick={onClickAddAddress}
        variant="default"
        className="w-full lg:w-fit flex items-center justify-center gap-1 border py-2 px-5 rounded-md hover:bg-silver-gray"
      >
        <HiPlusSmall size={20} className="translate-y-[1px]" />새 배송지 추가
      </ActionButton>
    </>
  );
};

export default AddressAddButton;
