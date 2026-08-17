import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

//새 배송지 추가 — 솔리드 primary 필 + 좌측 플러스 아이콘 (빈 상태·헤더 공용 스펙)
const AddressAddButton = () => {
  const { push } = useRouter();
  const onClickAddAddress = () => {
    push("/mypage/address/new");
  };

  return (
    <button
      type="button"
      onClick={onClickAddAddress}
      className="inline-flex h-10 items-center gap-1.5 rounded-full bg-purple-300 px-4 text-[13px] font-bold text-white transition-colors hover:bg-purple-400"
    >
      <Plus size={14} aria-hidden="true" />새 배송지 추가
    </button>
  );
};

export default AddressAddButton;
