import UserWishListItem from './UserWishListItem';
import type { UserWishListProps } from '@/types/mypage';

const UserWishList = ({ wishlists }: UserWishListProps) => {
  return (
    <>
      {wishlists.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] lg:h-[500px]">
          <h3>찜 목록이 없습니다.</h3>
        </div>
      ) : (
        <ul className="mt-5 flex flex-wrap justify-start md:gap-5">
          {wishlists.map((item, index) => (
            <UserWishListItem key={item.id} item={item} index={index} />
          ))}
        </ul>
      )}
    </>
  );
};

export default UserWishList;
