import { Button } from "@/components/ui/button";
import DefaultImage from "@/assets/images/default_image.avif";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useId } from "react";
import QuantitySelector from "../common/QuantitySelector";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartActions, useCartItems, useCheckoutActions, useSelectedItemIds } from "@/store/zustand";
import type { CartListItemProps } from "@/types/cart";

const CartListItem = ({ item }: CartListItemProps) => {
  const id = useId();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("selected");
  const cartItems = useCartItems();
  const selectedItems = useSelectedItemIds();
  const { setCartItems } = useCartActions();
  const { setSelectedItemIds: setSelectedItems } = useCheckoutActions();
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
    const newCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);

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
    <li className="relative rounded-2xl border border-gray-200 bg-card p-5">
      <label htmlFor={`${item.id}-${id}`} className="flex items-center gap-4">
        <input onChange={handleCheck} checked={isChecked} type="checkbox" id={`${item.id}-${id}`} className="shrink-0" />
        <div
          onClick={onClickDetailPage}
          className="relative h-[88px] w-[88px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200"
        >
          <Image
            src={item.thumbnail || DefaultImage}
            alt={item.title}
            className="h-full w-full object-cover"
            width={88}
            height={88}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="flex flex-wrap items-center gap-2 pr-6">
            <span className="text-[15px] font-bold">{item.title}</span>
            {item.delivery_info && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                {item.delivery_info}
              </span>
            )}
          </h3>
          <p className="text-[13px] uppercase text-gray-400">
            사이즈 {item.size} · 색상 {item.color}
          </p>
          <QuantitySelector
            className="mt-1"
            quantity={item.quantity}
            increase={handleIncrease}
            decrease={handleDecrease}
          />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5 pr-1 lg:pr-4">
          <span className="flex items-center gap-1.5 text-[13px]">
            <strong className="font-bold text-orange-500">{item.discount_rate}%</strong>
            <s className="text-gray-300">{formatPrice(price)}원</s>
          </span>
          <strong className="text-lg font-bold">{formatPrice(totalDiscountPrice)}원</strong>
        </div>
      </label>
      <Button
        variant="plain"
        size="auto"
        onClick={handleDeleteItem}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-500"
        aria-label={`${item.title} 삭제`}
      >
        <X size={15} />
      </Button>
    </li>
  );
};

export default CartListItem;
