import { signOut } from "@/lib/supabase/auth";
import { toast } from "./use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useResetRecoilState } from "recoil";
import { cartState } from "@/store";

const useSignOut = (onSuccess?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetCart = useResetRecoilState(cartState);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "로그아웃 되었습니다.",
      });

      //로그아웃 시 로컬스토리지 제거
      localStorage.removeItem("wishlist");
      localStorage.removeItem("shopping_cart");

      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      resetCart();

      onSuccess?.();
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "로그아웃 실패, 다시 시도해 주세요.",
        });
      }
    }
  };
  return { handleSignOut };
};

export default useSignOut;
