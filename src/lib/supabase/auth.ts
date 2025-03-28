import { Provider } from "@supabase/supabase-js";
import { supabase } from "./client";
import getRandomNickname from "../api/nickname";

//소셜 로그인
export const oAuthLogin = async (provider: Provider) => {
  try {
    sessionStorage.setItem("pendingAuth", "true");

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
      sessionStorage.removeItem("pendingAuth");
      throw new Error(`로그인에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//일반 회원가입
export const signUpEmail = async (email: string, password: string) => {
  try {
    const nickname = await getRandomNickname();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: nickname.data,
        },
      },
    });

    if (error) throw error;
    await supabase.auth.signOut();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`회원가입에 실패했습니다. ${error.message}`);
    }
    throw error;
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
    throw error;
  }
};

//로그아웃
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    if (error) {
      throw new Error("로그아웃에 실패했습니다.");
    }
    throw error;
  }
};

//닉네임 수정
export const updateNickname = async (name: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { name },
    });

    if (authError) throw authError;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("사용자 정보를 찾을 수 없습니다.");

    const { error: userError } = await supabase.from("user").update({ name: name }).eq("id", user.id);

    if (userError) throw userError;

    return authData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`닉네임 변경에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
