import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ShopListItem } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopListItem;
  quantity: number;
}

const AddToCartDrawer = ({ isOpen, onClose, product, quantity }: CartDrawerProps) => {
  const { push } = useRouter();

  const onClickCart = () => {
    push("/cart");
  };

  //당일배송 상품만 당일 출발 카피 노출
  const subCopy = product.delivery_info?.includes("당일")
    ? "지금 주문하면 오늘 바로 출발해요"
    : "담은 상품은 장바구니에서 확인할 수 있어요";

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        {/* 시안 기준: 체크 서클 + 좌측 정렬 헤더 */}
        <DrawerHeader className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-50">
              <Check size={20} className="text-purple-500" aria-hidden />
            </span>
            <div className="text-left">
              <DrawerTitle className="py-0 text-left text-[17px] font-bold">장바구니에 담았어요!</DrawerTitle>
              <DrawerDescription className="mt-0.5 text-[13px] text-gray-500">{subCopy}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        {/* 담긴 상품 요약 카드 */}
        <div className="mx-auto mt-1 w-full max-w-md px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5">
          <Image
            src={product.thumbnail || DefaultImage}
            alt={product.title}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.title}</p>
            <p className="mt-0.5 text-xs text-gray-400">수량 {quantity}개</p>
          </div>
          <strong className="shrink-0 text-[15px] font-bold">
            {formatPrice(getDiscountedPrice(product) * quantity)}원
          </strong>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 pb-10 pt-5">
          <Button
            size="auto"
            onClick={onClickCart}
            className="h-[52px] w-full gap-2 rounded-full bg-gradient-to-r from-purple-400 to-orange-300 text-[15px] font-bold text-white hover:opacity-90"
          >
            <ShoppingCart size={17} aria-hidden />
            장바구니 보기
          </Button>
          <DrawerClose asChild>
            <Button variant="plain" size="auto" className="text-sm font-semibold text-gray-500 underline">
              계속 쇼핑하기
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddToCartDrawer;
