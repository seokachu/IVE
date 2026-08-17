import UserWishListItem from "./UserWishListItem";
import type { UserWishListProps } from "@/types/mypage";

//찜 목록 그리드 — 굿즈샵 카드와 동일한 3열 (.pen 마이페이지 시안의 WishGrid)
const UserWishList = ({ wishlists }: UserWishListProps) => {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6">
      {wishlists.map((item, index) => (
        <UserWishListItem key={item.id} item={item} index={index} />
      ))}
    </ul>
  );
};

export default UserWishList;
