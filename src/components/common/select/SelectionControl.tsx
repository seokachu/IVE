import { useEffect, useId, useState } from "react";
import ActionButton from "../button/ActionButton";
import { useRecoilState } from "recoil";
import { cartState, selectedItemState } from "@/store";
import { toast } from "@/hooks/use-toast";
import ConfirmModal from "../modal/ConfirmModal";

const SelectionControl = () => {
  const id = useId();
  const [cartItems, setCartItems] = useRecoilState(cartState);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemState);
  const [isModal, setIsModal] = useState(false);

  //컴포넌트가 마운트 되었을 때 장바구니 모든 아이템 선택하기
  useEffect(() => {
    setSelectedItems(cartItems.map((item) => item.id));
  }, []);

  //전체선택
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  //선택삭제 버튼
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택한 내용이 없습니다.",
        variant: "destructive",
      });
      return;
    }
    const newCartItems = cartItems.filter(
      (item) => !selectedItems.includes(item.id)
    );
    localStorage.setItem("shopping_cart", JSON.stringify(newCartItems));
    setCartItems(newCartItems);
    setSelectedItems([]);
    toast({
      title: "선택한 내용이 삭제 되었습니다.",
    });
  };

  //전체삭제 버튼 클릭시 모달
  const handleDeleteAll = () => {
    setIsModal(true);
  };

  //전체삭제 확인 액션
  const handleConfirmDeleteAll = () => {
    localStorage.setItem("shopping_cart", JSON.stringify([]));
    setCartItems([]);
    setSelectedItems([]);
  };

  return (
    <div className="flex text-sm items-center justify-between mt-5 pb-5 border-b border-dark-gray">
      <label htmlFor={`selectAll-${id}`}>
        <input
          type="checkbox"
          id={`selectAll-${id}`}
          className="mr-[6px] w-4 h-4 translate-y-[3px]"
          checked={selectedItems.length === cartItems.length}
          onChange={handleSelectAll}
        />
        전체선택 {selectedItems.length}/{cartItems.length}
      </label>
      <div className="flex gap-2">
        <ActionButton
          variant="outline"
          className="px-2 py-1 border rounded-md"
          onClick={handleDeleteSelected}
        >
          선택삭제
        </ActionButton>
        <ActionButton
          variant="primary"
          className="px-2 py-1 border rounded-md"
          onClick={handleDeleteAll}
        >
          전체삭제
        </ActionButton>
      </div>
      {isModal && (
        <ConfirmModal
          isOpen={setIsModal}
          onConfirm={handleConfirmDeleteAll}
          title="장바구니 비우기"
          description="장바구니의 모든 상품이 삭제됩니다. 정말 비우시겠습니까?"
          cancelText="취소"
          confirmText="비우기"
        />
      )}
    </div>
  );
};

export default SelectionControl;
