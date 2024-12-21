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
    queryFn: async () => {
      if (session) {
        const result = await checkedWishLists(session.user.id, productId);
        return result;
      } else {
        const result = wishlistStorage.isCheckedWishList(productId);
        return result;
      }
    },
    enabled: !!productId,
    initialData: false,
  });
  const toggleWishList = async () => {
    if (!productId) return;
    try {
      const currentWishState = isWished ?? false;

      if (session) {
        if (currentWishState) {
          await removeWishList(session.user.id, productId);
        } else {
          await addToWishList(session.user.id, productId);
        }
      } else {
        if (currentWishState) {
          wishlistStorage.removeWishList(productId);
        } else {
          wishlistStorage.addWishList({
            id: crypto.randomUUID(),
            product_id: productId,
            user_id: null,
            created_at: new Date().toISOString(),
          });
        }
      }
      await queryClient.invalidateQueries({
        queryKey: ["wishlist", productId],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`찜하기 토글 중 에러가 발생했습니다. ${error.message}`);
      }
    }
  };

  return { isWished: !!isWished, toggleWishList };
};

export default useWishListWithLocal;
