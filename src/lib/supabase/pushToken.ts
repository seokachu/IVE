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

//내 푸시 알림 설정 조회: 등록된 기기가 있는지, 알림이 켜져 있는지
export const getPushSetting = async (userId: string) => {
  const { data, error } = await supabase.from("push_tokens").select("enabled").eq("user_id", userId);

  if (error) throw error;
  return {
    hasToken: (data?.length ?? 0) > 0,
    enabled: data?.some((row: { enabled: boolean }) => row.enabled) ?? false,
  };
};

//내 모든 기기의 알림 수신 설정 변경
export const setPushEnabled = async (userId: string, enabled: boolean) => {
  const { error } = await supabase.from("push_tokens").update({ enabled }).eq("user_id", userId);

  if (error) throw error;
};
