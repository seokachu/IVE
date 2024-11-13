import { Provider } from "@supabase/supabase-js";
import { supabase } from "./client";

//로그인
export const oAuthLogin = async (provider: Provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`로그인에 실패했습니다. ${error.message}`);
    }
  }
};

//로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("로그아웃에 실패했습니다.");
  }
};
