import { addToWishList, checkedWishLists, removeWishList } from '@/lib/supabase/wishlist';
import { sessionState } from '@/store';
import { wishlistStorage } from '@/utils/wishlistStorage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { toast } from '../use-toast';

const useWishListWithLocal = (productId: string) => {
  const session = useRecoilValue(sessionState);
  const queryClient = useQueryClient();

  const { data: isWished } = useQuery({
    queryKey: ['wishlists', 'product', productId],
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
          toast({
            title: '찜하기가 취소되었습니다.',
          });
        } else {
          await addToWishList(session.user.id, productId);
          toast({
            title: '찜하기가 추가되었습니다.',
          });
        }
      } else {
        if (currentWishState) {
          wishlistStorage.removeWishList(productId);
          toast({
            title: '찜하기가 취소되었습니다.',
          });
        } else {
          wishlistStorage.addWishList({
            id: crypto.randomUUID(),
            product_id: productId,
            user_id: null,
            created_at: new Date().toISOString(),
          });
          toast({
            title: '찜하기가 추가되었습니다.',
          });
        }
      }
      await queryClient.invalidateQueries({
        queryKey: ['wishlists', 'product', productId],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`찜하기 처리 중 에러가 발생했습니다. ${error.message}`);
      }
    }
  };

  return { isWished: !!isWished, toggleWishList };
};

export default useWishListWithLocal;
