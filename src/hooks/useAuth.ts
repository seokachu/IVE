import axios from "axios";
import { sessionState } from "@/store";
import { useSetRecoilState } from "recoil";
import { supabase } from "@/lib/supabase/client";
import { wishlistStorage } from "@/utils/wishlistStorage";
import { addToWishList, checkedWishLists } from "@/lib/supabase/wishlist";
import { useCallback, useRef } from "react";
import { toast } from "./use-toast";
import type { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const setSession = useSetRecoilState(sessionState);
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
            const isAlreadyWished = await checkedWishLists(
              session.user.id,
              item.product_id
            );
            if (!isAlreadyWished) {
              await addToWishList(session.user.id, item.product_id);
            }
          }
        }
        localStorage.removeItem("wishlist");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `찜 목록 동기화 중 에러가 발생했습니다. ${error.message}`
        );
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
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session.access_token}`;
        await syncWishlist(session);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);

        if (session && sessionStorage.getItem("pendingAuth")) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${session.access_token}`;
          await syncWishlist(session);
          sessionStorage.removeItem("pendingAuth");
          toast({
            title: "로그인 되었습니다.",
          });
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
