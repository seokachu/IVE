import { Tables } from "@/types/supabase";
import UserWishListItem from "./UserWishListItem";

interface UserWishListProps {
  wishlists: Tables<"wish_lists">[];
}

const UserWishList = ({ wishlists }: UserWishListProps) => {
  return (
    <ul className="mt-5 flex flex-wrap lg:justify-between sm:justify-center gap-6">
      {wishlists.map((item) => (
        <UserWishListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default UserWishList;
