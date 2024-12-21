import {
  addToWishList,
  checkedWishLists,
  getUserWishList,
  removeWishList,
} from "@/lib/supabase/like";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//전체 리스트 조회
export const useWishLists = (userId: string) => {
  return useQuery({
    queryKey: ["wishLists", userId],
    queryFn: () => getUserWishList(userId),
    enabled: !!userId,
  });
};

//특정 상품 찜 여부 확인
export const useCheckedWishLists = (userId: string, productId: string) => {
  return useQuery({
    queryKey: ["wishList", userId, productId],
    queryFn: () => checkedWishLists(userId, productId),
    enabled: !!userId && !!productId,
  });
};

//찜하기 추가
export const useAddWishList = (userId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addToWishList(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishLists", userId] });
      queryClient.invalidateQueries({
        queryKey: ["wishList", userId, productId],
      });
    },
  });
};

//찜하기 삭제
export const useRemoveWishList = (userId: string, productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeWishList(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishLists", userId] });
      queryClient.invalidateQueries({
        queryKey: ["wishList", userId, productId],
      });
    },
  });
};
