import axios from "axios";
import { sessionState } from "@/store";
import { useSetRecoilState } from "recoil";
import { supabase } from "@/lib/supabase/client";

export const useAuth = () => {
  const setSession = useSetRecoilState(sessionState);

  const initializeAuth = async () => {
    try {
      //세션 가져오기
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session.access_token}`;
      }

      //세션 상태 변화 감지
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${session.access_token}`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setSession(null);
    }
  };
  return { initializeAuth };
};
