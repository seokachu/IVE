import { Provider } from "@supabase/supabase-js";
import { supabase } from "./client";

//FIXME - 닉네임 수정 예정
type UserMetadata = {
  name?: string;
};

//소셜 로그인
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

//일반 회원가입
export const signUpEmail = async (
  email: string,
  password: string,
  metadata?: UserMetadata
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`회원가입에 실패했습니다. ${error.message}`);
    }
  }
};

//일반 로그인
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
