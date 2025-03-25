import Image from 'next/image';
import DefaultImage from '@/assets/images/default_image.avif';
import Badge from '@/components/common/Badge';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { formatPrice, getDiscountedPrice } from '@/utils/calculateDiscount';
import { GoHeartFill } from 'react-icons/go';
import { useWishListItem } from '@/hooks/queries/useShops';
import { useRemoveWishList } from '@/hooks/queries/useWishList';
import { toast } from '@/hooks/use-toast';
import { useAverageRating } from '@/hooks/queries/useReviews';
import type { UserWishListItemProps } from '@/types/mypage';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
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
      title: '찜하기가 취소되었습니다.',
    });
  };

  return (
    <li
      onClick={onClickDetail}
      onKeyDown={handleKeyDown}
      className="w-2/6 md:w-[calc(33.333%-0.9rem)] md:border p-0 md:p-4 md:rounded-lg cursor-pointer md:hover:shadow-lg group mb-7 md:mb-5"
      tabIndex={0}
      aria-label={`상품: ${goodsItem.title}, 가격: ${goodsItem.price}원, 할인율: ${goodsItem.discount_rate}%`}
    >
      <div className="relative w-full h-auto md:rounded-lg overflow-hidden aspect-square border">
        <Image
          src={goodsItem.thumbnail || DefaultImage}
          alt={goodsItem.title || '상품 썸네일 이미지'}
          className="fill group-hover:scale-110 transition-transform duration-300 w-full"
          width={250}
          height={250}
          loading={index < 6 ? 'eager' : 'lazy'}
          priority={index < 6}
        />
        <button onClick={onClickHeart} className="absolute right-2 bottom-2 text-dark-gray" aria-label="찜하기 취소">
          <GoHeartFill size={30} className="opacity-90 transition-colors text-rose-500" />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="mt-2 md:mt-4 mb-1 min-h-[20px]">
          <Badge item={goodsItem} averageRating={averageRating} />
        </div>
        <h3 className="text-xs lg:text-base overflow-hidden overflow-ellipsis whitespace-nowrap">{goodsItem.title}</h3>
        <div className="font-bold flex items-start md:items-center gap-1 lg:gap-2 text-sm lg:text-xl">
          <span className="text-purple">{goodsItem.discount_rate}%</span>
          <span className="whitespace-nowrap">{formatPrice(price)}원</span>
        </div>
        <div className="flex items-center gap-1 text-[#878f91] text-xs lg:text-sm">
          <FaStar />
          <span>{averageRating}</span>
        </div>
      </div>
    </li>
  );
};

export default UserWishListItem;
