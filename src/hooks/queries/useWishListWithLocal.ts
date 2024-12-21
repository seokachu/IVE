import {
  addToWishList,
  checkedWishLists,
  removeWishList,
} from "@/lib/supabase/wishlist";
import { sessionState } from "@/store";
import { wishlistStorage } from "@/utils/wishlistStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

const useWishListWithLocal = (productId: string) => {
  const session = useRecoilValue(sessionState);
  const queryClient = useQueryClient();

  const { data: isWished } = useQuery({
    queryKey: ["wishlist", productId],
    queryFn: () => {
      if (session) {
        return checkedWishLists(session.user.id, productId);
      } else {
        return wishlistStorage.isCheckedWishList(productId);
      }
    },
    enabled: !!productId,
  });

  //찜하기 토글
  const toggleWishList = async () => {
    if (!productId) return;

    if (session) {
      if (isWished) {
        await removeWishList(session.user.id, productId);
      } else {
        await addToWishList(session.user.id, productId);
      }
    } else {
      if (isWished) {
        wishlistStorage.removeWishList(productId);
      } else {
        wishlistStorage.addWishList({
          id: productId,
          product_id: productId,
          user_id: null,
          created_at: new Date().toISOString(),
        });
      }
    }

    queryClient.invalidateQueries({ queryKey: ["wishlist", productId] });
  };

  return { isWished, toggleWishList };
};

export default useWishListWithLocal;
