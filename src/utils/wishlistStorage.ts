import { addToWishList } from "@/lib/supabase/wishlist";
import type { WishListItem } from "@/types";

export const wishlistStorage = {
  //찜 목록 불러오기
  getWishList: (): WishListItem[] => {
    if (typeof window === "undefined") return [];
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
  },

  //특정상품 찜 되어 있는지 확인
  isCheckedWishList: (itemId: string): boolean => {
    const currentWishlist = wishlistStorage.getWishList();
    return currentWishlist.some((item) => item.id === itemId);
  },

  //찜하기 추가
  addWishList: (item: WishListItem) => {
    const currentWishlist = wishlistStorage.getWishList();
    if (!wishlistStorage.isCheckedWishList(item.id)) {
      const newWishlist = [...currentWishlist, item];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    }
    return currentWishlist;
  },

  //찜하기 취소
  removeWishList: (itemId: string) => {
    const currentWishlist = wishlistStorage.getWishList();
    const newWishlist = currentWishlist.filter((item) => item.id !== item.id);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    return newWishlist;
  },

  //찜하기 목록 로그인 시 동기화하기
  wishlistDatabase: async (userId: string) => {
    const localWishlist = wishlistStorage.getWishList();
    for (const item of localWishlist) {
      try {
        await addToWishList(userId, item.id);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
      localStorage.removeItem("wishlist");
    }
  },
};
