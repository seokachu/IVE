import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HiPlusSmall } from "react-icons/hi2";

const AddressAddButton = () => {
  const { push } = useRouter();
  const onClickAddAddress = () => {
    push("/mypage/address/new");
  };

  return (
    <>
      <Button
        onClick={onClickAddAddress}
        variant="outline" size="auto"
        className="text-sm w-full lg:w-fit flex items-center justify-center gap-1 border py-2 px-5 rounded-md hover:bg-gray-200"
      >
        <HiPlusSmall size={20} />새 배송지 추가
      </Button>
    </>
  );
};

export default AddressAddButton;
