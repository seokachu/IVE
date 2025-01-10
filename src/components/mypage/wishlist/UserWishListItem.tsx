import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import Badge from "@/components/common/Badge";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { GoHeartFill } from "react-icons/go";
import { useShopLists } from "@/hooks/queries/useShops";
import { useRemoveWishList } from "@/hooks/queries/useWishList";
import { toast } from "@/hooks/use-toast";
import { UserWishListItemProps } from "@/types";
import { useAverageRating } from "@/hooks/queries/useReviews";

const UserWishListItem = ({ item }: UserWishListItemProps) => {
  const { push } = useRouter();
  const {
    data: goodsItem,
    isLoading,
    isSuccess,
  } = useShopLists(item.product_id);
  const { data: averageRating = 0 } = useAverageRating(item.product_id!);

  //찜하기 삭제 mutation
  const { mutate: removeWishList } = useRemoveWishList(
    item.user_id!,
    item.product_id!
  );

  if (isLoading) return null;
  if (!isSuccess || !goodsItem) return null;

  //할인율 적용
  const price = getDiscountedPrice(goodsItem);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClickDetail();
    }
  };

  const onClickDetail = () => {
    push(`/shop/${item.product_id}`);
  };

  //찜하기 취소
  const onClickHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeWishList();
    toast({
      title: "찜하기가 취소되었습니다. ",
    });
  };

  return (
    <li
      onClick={onClickDetail}
      onKeyDown={handleKeyDown}
      className="w-[90%] sm:w-[280px] sm:justify-center md:w-[calc(33.333%-1rem)] lg:w-[calc(33%-1.2rem)] border p-4 rounded-lg cursor-pointer hover:shadow-lg group mb-5"
      role="button"
      tabIndex={0}
    >
      <div className="relative w-full h-auto rounded-lg overflow-hidden border">
        <Image
          src={goodsItem.thumbnail || DefaultImage}
          alt="썸네일"
          className="fill group-hover:scale-110 transition-transform duration-300 w-full"
          width={250}
          height={250}
        />
        <button
          onClick={onClickHeart}
          className="absolute right-2 bottom-2 text-dark-gray"
          aria-label="찜하기 취소"
        >
          <GoHeartFill
            size={30}
            className="opacity-90 transition-colors text-rose-500"
          />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="mt-4 mb-1 min-h-[20px]">
          <Badge item={goodsItem} averageRating={averageRating} />
        </div>
        <h3 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap">
          {goodsItem.title}
        </h3>
        <div className="font-bold flex items-center gap-2 text-xl">
          <span className="text-purple">{goodsItem.discount_rate}%</span>
          <span>{formatPrice(price)}원</span>
        </div>
        <div className="flex items-center gap-1 text-[#878f91] text-sm">
          <FaStar />
          <span>{averageRating}</span>
        </div>
      </div>
    </li>
  );
};

export default UserWishListItem;
