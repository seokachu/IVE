import { Tables } from "@/types/supabase";
import UserWishListItem from "./UserWishListItem";

interface UserWishListProps {
  wishlists: Tables<"wish_lists">[];
}

const UserWishList = ({ wishlists }: UserWishListProps) => {
  return (
    <ul className="mt-5 flex justify-between">
      {wishlists.map((item) => (
        <UserWishListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default UserWishList;
