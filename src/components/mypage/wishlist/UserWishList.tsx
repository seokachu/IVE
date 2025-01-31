import UserWishListItem from "./UserWishListItem";
import { UserWishListProps } from "@/types";

const UserWishList = ({ wishlists }: UserWishListProps) => {
  return (
    <>
      {wishlists.length === 0 ? (
        <div className="flex items-center justify-center h-[500px]">
          <h3>찜 목록이 없습니다.</h3>
        </div>
      ) : (
        <ul className="mt-5 flex flex-wrap justify-start md:gap-5">
          {wishlists.map((item) => (
            <UserWishListItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </>
  );
};

export default UserWishList;
