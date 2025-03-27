import { addToWishList } from "@/lib/supabase/wishlist";
import type { WishListItem } from "@/types";

export const wishlistStorage = {
  //찜하기 목록 로그인 시 동기화하기
  wishlistDatabase: async (userId: string) => {
    try {
      const localWishlist = wishlistStorage.getWishList();
      //DB와 동기화
      for (const item of localWishlist) {
        await addToWishList(userId, item.product_id as string);
      }
      localStorage.removeItem("wishlist");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return false;
    }
  },

  //찜 목록 불러오기
  getWishList: (): WishListItem[] => {
    if (typeof window === "undefined") return [];
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
  },

  //특정상품 찜 되어 있는지 확인
  isCheckedWishList: (itemId: string): boolean => {
    const currentWishlist = wishlistStorage.getWishList();
    return currentWishlist.some((item) => item.product_id === itemId);
  },

  //찜하기 추가
  addWishList: (item: WishListItem) => {
    const currentWishlist = wishlistStorage.getWishList();
    if (!wishlistStorage.isCheckedWishList(item.product_id as string)) {
      const newWishlist = [
        ...currentWishlist,
        {
          id: crypto.randomUUID(),
          product_id: item.product_id,
          user_id: null,
          created_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    }
    return currentWishlist;
  },

  //찜하기 취소
  removeWishList: (productId: string) => {
    const currentWishlist = wishlistStorage.getWishList();
    const newWishlist = currentWishlist.filter((item) => item.product_id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    return newWishlist;
  },
};
