import DefaultImage from "@/assets/images/default_image.avif";
import { cartState, selectedItemState } from "@/store";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { useEffect, useId } from "react";
import { useRecoilState } from "recoil";
import QuantitySelector from "../common/QuantitySelector";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import type { CartListItemProps } from "@/types";

const CartListItem = ({ item }: CartListItemProps) => {
  const id = useId();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("selected");
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemState);
  const [cartItems, setCartItems] = useRecoilState(cartState);
  const isChecked = selectedItems.includes(item.id);

  const discountPrice = getDiscountedPrice(item);
  const price = item.price * item.quantity;
  const totalDiscountPrice = discountPrice * item.quantity;

  useEffect(() => {
    if (selectedParam) {
      try {
        const parsedSelected = JSON.parse(decodeURIComponent(selectedParam));
        setSelectedItems(parsedSelected);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "목록을 가져오는데 실패했습니다.",
            description: error.message,
          });
        }
      }
    }
  }, [selectedParam, setSelectedItems]);

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

  const handleIncrease = () => {
    if (item.quantity >= 5) {
      toast({
        title: "최대 5개 까지 구매 가능합니다.",
      });
      return;
    }

    const newCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: Math.min(cartItem.quantity + 1, 5),
        };
      }
      return cartItem;
    });

    localStorage.setItem("shopping_cart", JSON.stringify(newCartItems));
    setCartItems(newCartItems);
  };

  const handleDecrease = () => {
    const newCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return {
          ...cartItem,
          quantity: Math.max(cartItem.quantity - 1, 1),
        };
      }
      return cartItem;
    });

    localStorage.setItem("shopping_cart", JSON.stringify(newCartItems));
    setCartItems(newCartItems);
  };

  const onClickDetailPage = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    push(`/shop/${item.id}`);
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
        <div
          onClick={onClickDetailPage}
          className="relative w-[80px] h-[80px] overflow-hidden rounded-md mx-5 flex-shrink-0 border cursor-pointer"
        >
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
            <h3 className="flex flex-wrap gap-1 lg:items-center flex-col lg:flex-row">
              <span className="font-bold shrink-0">{item.title}</span>
              <span className="text-sm lg:text-xs text-gray-500 shrink-0">
                {item.delivery_info}
              </span>
            </h3>
            <p className="text-gray-500 text-sm flex flex-wrap flex-col lg:flex-row gap-1 my-1 uppercase">
              <span className="shrink-0">사이즈 : {item.size}</span>
              <span className="hidden lg:block">&#47;</span>
              <span className="shrink-0">색상 : {item.color}</span>
            </p>
            <QuantitySelector
              className="text-sm text-gray-400 mr-3"
              quantity={item.quantity}
              increase={handleIncrease}
              decrease={handleDecrease}
            />
          </div>
          <div className="lg:text-right flex-1">
            <span className="mr-1 text-purple font-bold">
              {item.discount_rate}%
            </span>
            <s className="text-dark-gray text-sm mr-1 lg:mr-0 text-nowrap">
              {price}원
            </s>
            <strong>{formatPrice(totalDiscountPrice)}원</strong>
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

export default CartListItem;
