import axios from "axios";
import { supabase } from "@/lib/supabase/client";
import { wishlistStorage } from "@/utils/wishlistStorage";
import { addToWishList, checkedWishLists } from "@/lib/supabase/wishlist";
import { syncAvatarToPublicUser } from "@/lib/supabase/profileSync";
import { useCallback, useRef } from "react";
import { toast } from "./use-toast";
import { useSessionActions } from "@/store/zustand";
import type { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const { setSession } = useSessionActions();
  const isSyncing = useRef(false);

  const syncWishlist = async (session: Session) => {
    // 이미 동기화 중이면 실행하지 않음
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      const localWishlist = wishlistStorage.getWishList();

      if (localWishlist.length > 0) {
        for (const item of localWishlist) {
          if (item.product_id) {
            const isAlreadyWished = await checkedWishLists(session.user.id, item.product_id);
            if (!isAlreadyWished) {
              await addToWishList(session.user.id, item.product_id);
            }
          }
        }
        localStorage.removeItem("wishlist");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`찜 목록 동기화 중 에러가 발생했습니다. ${error.message}`);
      }
    } finally {
      isSyncing.current = false;
    }
  };

  const initializeAuth = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${session.access_token}`;
        await syncAvatarToPublicUser(session.user);
        await syncWishlist(session);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);

        if (session && sessionStorage.getItem("pendingAuth")) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${session.access_token}`;
          await syncAvatarToPublicUser(session.user);
          await syncWishlist(session);
          sessionStorage.removeItem("pendingAuth");
          toast({
            title: "로그인 되었습니다.",
          });
          //OAuth 로그인 전 저장해 둔 복귀 경로로 이동 (OAuth는 항상 홈으로 돌아오므로)
          const redirectUrl = sessionStorage.getItem("redirectUrl");
          sessionStorage.removeItem("redirectUrl");
          if (redirectUrl && redirectUrl !== "/" && window.location.pathname === "/") {
            window.location.replace(redirectUrl);
          }
        } else if (!session) {
          delete axios.defaults.headers.common["Authorization"];
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Auth 로그인 에러 ${error.message}`);
      }
      setSession(null);
    }
  }, [setSession]);

  return { initializeAuth };
};
