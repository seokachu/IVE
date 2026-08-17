import { Button } from "@/components/ui/button";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import Badge from "@/components/common/Badge";
import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { useWishListItem } from "@/hooks/queries/useShops";
import { useRemoveWishList } from "@/hooks/queries/useWishList";
import { toast } from "@/hooks/use-toast";
import { useAverageRating } from "@/hooks/queries/useReviews";
import type { UserWishListItemProps } from "@/types/mypage";

//찜 카드 — 굿즈샵 ShopListItem과 동일한 카드, 하트만 채워진 상태(=찜 취소) (.pen 마이페이지 시안)
const UserWishListItem = ({ item, index }: UserWishListItemProps) => {
  const { push } = useRouter();
  const { data: goodsItem, isLoading, isSuccess } = useWishListItem(item.product_id);
  const { data: averageRating = 0 } = useAverageRating(item.product_id!);

  //찜하기 삭제 mutation
  const { mutate: removeWishList } = useRemoveWishList(item.user_id!, item.product_id!);

  if (isLoading) return null;
  if (!isSuccess || !goodsItem) return null;

  //할인율 적용
  const price = getDiscountedPrice(goodsItem);

  const onClickDetail = () => {
    push(`/shop/${item.product_id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClickDetail();
    }
  };

  //찜하기 취소
  const onClickHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWishList();
    toast({ title: "찜하기가 취소되었습니다." });
  };

  return (
    <li
      onClick={onClickDetail}
      onKeyDown={handleKeyDown}
      className="w-full cursor-pointer group"
      tabIndex={0}
      aria-label={`상품: ${goodsItem.title}, 가격: ${goodsItem.price}원, 할인율: ${goodsItem.discount_rate}%`}
    >
      <div className="relative w-full h-auto rounded-lg overflow-hidden aspect-square bg-gray-100 border border-gray-200">
        <Image
          src={goodsItem.thumbnail || DefaultImage}
          alt={goodsItem.title || "상품 썸네일 이미지"}
          className="group-hover:scale-110 transition-transform duration-300 object-cover w-full"
          width={250}
          height={250}
          loading={index < 6 ? "eager" : "lazy"}
          priority={index < 6}
        />
        <div className="absolute top-2.5 left-2.5">
          <Badge item={goodsItem} averageRating={averageRating} />
        </div>
        <Button
          variant="plain"
          size="auto"
          onClick={onClickHeart}
          className="absolute right-2.5 top-2.5 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-[#EEEEEE]"
          aria-label="찜하기 취소"
        >
          <Heart size={17} fill="currentColor" className="text-red" />
        </Button>
      </div>
      <div className="flex flex-col gap-1 mt-2.5">
        <h3 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold">{goodsItem.title}</h3>
        <div className="font-bold flex items-center flex-wrap gap-x-1.5 lg:gap-x-2 text-[15px]">
          {(goodsItem.discount_rate ?? 0) > 0 && <span className="text-orange-500">{goodsItem.discount_rate}%</span>}
          <span className="whitespace-nowrap">{formatPrice(price)}원</span>
          <span className="flex items-center gap-1 text-gray-400 text-xs font-normal">
            <Star size={13} className="text-warning fill-warning" />
            {averageRating}
          </span>
        </div>
      </div>
    </li>
  );
};

export default UserWishListItem;
