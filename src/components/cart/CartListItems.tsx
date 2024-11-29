import DefaultImage from "@/assets/images/default_image.avif";
import { cartState, selectedItemState } from "@/store";
import type { CartListItemProps } from "@/types";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { useId } from "react";
import { useRecoilState } from "recoil";

const CartListItems = ({ item }: CartListItemProps) => {
  const id = useId();
  const price = getDiscountedPrice(item);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemState);
  const [cartItems, setCartItems] = useRecoilState(cartState);

  const isChecked = selectedItems.includes(item.id);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item.id]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    }
  };

  //개별 삭제
  const handleDeleteItem = () => {
    // 삭제할 아이템을 제외한 새로운 장바구니 목록 생성
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );

    // 로컬스토리지와 장바구니 상태 동기화
    localStorage.setItem("shopping_cart", JSON.stringify(newCartItems));
    setCartItems(newCartItems);

    // 체크된 상태에서 삭제된 경우 체크 목록에서도 제거
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    }
  };

  return (
    <li className="px-2 py-4 relative border-b">
      <label htmlFor={`${item.id}-${id}`} className="flex">
        <input
          onChange={handleCheck}
          checked={isChecked}
          type="checkbox"
          id={`${item.id}-${id}`}
          className="w-4 h-4 flex-shrink-0"
        />
        <div className="relative w-[80px] h-[80px] overflow-hidden rounded-md mx-5 flex-shrink-0 border">
          <Image
            src={item.thumbnail || DefaultImage}
            alt={item.title}
            className="object-cover fill"
            width={80}
            height={80}
          />
        </div>
        <div className="flex w-full lg:gap-3 lg:flex-row flex-col lg:items-center lg:justify-between">
          <div className="flex-[4] mr-9 flex flex-col justify-between">
            <h3>{item.title}</h3>
            <p className="text-sm mt-1 text-gray-400">수량 {item.quantity}</p>
          </div>
          <div className="lg:text-right flex-1">
            <span className="mr-1 text-purple font-bold">
              {item.discount_rate}%
            </span>
            <s className="text-dark-gray text-sm mr-1 lg:mr-0 text-nowrap">
              {item.price}원
            </s>
            <strong>{formatPrice(price)}원</strong>
          </div>
        </div>
      </label>
      <button
        onClick={handleDeleteItem}
        className="absolute right-2 top-[10px] hover:text-purple"
      >
        &times;
      </button>
    </li>
  );
};

export default CartListItems;
