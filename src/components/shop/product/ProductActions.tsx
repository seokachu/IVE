"use client";
import ActionButton from "@/components/common/button/ActionButton";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { IoIosHeartEmpty } from "react-icons/io";

const ProductActions = () => {
  const { push } = useRouter();
  const onClickCart = () => {
    toast({
      title: "장바구니에 담았습니다.",
    });
  };

  const onClickBuying = () => {
    push("/cart");
  };

  return (
    <ul className="flex items-stretch justify-center gap-3">
      <li className="w-1/6">
        <ActionButton
          variant="primary"
          className="w-full h-full flex items-center justify-center py-5"
        >
          <IoIosHeartEmpty size={25} className="text-white" />
        </ActionButton>
      </li>
      <li className="w-2/4">
        <ActionButton
          onClick={onClickCart}
          variant="outline"
          className="w-full py-3 text-center"
        >
          장바구니
        </ActionButton>
      </li>
      <li className="w-2/4">
        <ActionButton
          onClick={onClickBuying}
          variant="primary"
          className="w-full py-3 text-center"
        >
          구매하기
        </ActionButton>
      </li>
    </ul>
  );
};

export default ProductActions;
