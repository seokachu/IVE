import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "./use-toast";
import { useCartActions, useSessionActions } from "@/store/zustand";

//회원탈퇴: 서버에서 계정을 삭제한 뒤 로그아웃과 동일한 로컬 정리를 수행
const useWithdraw = (onSuccess?: () => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { resetCart } = useCartActions();
  const { clearSession } = useSessionActions();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "회원탈퇴에 실패했습니다.");

      //계정이 이미 삭제된 상태라 서버 로그아웃은 실패할 수 있음 — 로컬 세션만 정리
      await supabase.auth.signOut({ scope: "local" }).catch(() => {});

      localStorage.removeItem("wishlist");
      localStorage.removeItem("shopping_cart");
      queryClient.clear();
      resetCart();
      clearSession();

      toast({
        title: "회원탈퇴가 완료되었습니다.",
        description: "그동안 이용해 주셔서 감사합니다.",
      });
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "회원탈퇴에 실패했습니다.",
        description: "잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return { handleWithdraw, isWithdrawing };
};

export default useWithdraw;
