import { supabase } from "@/lib/supabase/client";
import { useRecoilState } from "recoil";
import { sessionState } from "@/store";

export const useUpdateUserSession = () => {
  const [, setSession] = useRecoilState(sessionState);

  const updateUserAndRefresh = async (updateData: {
    data: { [key: string]: string };
  }) => {
    const { error } = await supabase.auth.updateUser(updateData);
    if (error) throw error;

    await supabase.auth.refreshSession();
    const {
      data: { session: newSession },
    } = await supabase.auth.getSession();

    if (newSession) {
      setSession(newSession);
    }
  };

  return { updateUserAndRefresh };
};
