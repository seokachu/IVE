import { supabase } from "@/lib/supabase/client";

//하이브리드 앱 WebView가 주입한 Expo 푸시 토큰을 로그인한 사용자에게 연결
export const upsertPushToken = async (userId: string, token: string, platform?: string) => {
  const { error } = await supabase.from("push_tokens").upsert(
    {
      token,
      user_id: userId,
      platform: platform ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );

  if (error) throw error;
};
