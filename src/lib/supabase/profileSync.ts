import { supabase } from "./client";
import type { User } from "@supabase/supabase-js";

/**
 * 소셜 로그인 프로필 이미지를 public.user.avatar_url에 내려 적는다.
 *
 * 구글·카카오 프로필은 auth 메타데이터에만 존재해서 본인 세션에서만 읽을 수 있다.
 * 리뷰·댓글·게시판은 조인한 public.user.avatar_url을 보므로,
 * 동기화하지 않으면 남의 화면에서는 계속 이니셜 서클로만 보인다.
 * (커스텀 업로드는 storage.uploadAvatar가 이미 두 곳에 함께 기록한다)
 *
 * 로그인 흐름을 막으면 안 되는 부가 작업이라 실패해도 조용히 넘어간다.
 */
//카카오는 프로필 URL을 http로 내려준다 — https 페이지에서 그대로 쓰면 혼합 콘텐츠로 차단된다
const toHttps = (url: string) => url.replace(/^http:\/\//, "https://");

export const syncAvatarToPublicUser = async (user: User | null | undefined) => {
  if (!user) return;

  const rawCustom = user.user_metadata?.custom_avatar_url as string | undefined;
  const rawProvider = user.user_metadata?.avatar_url as string | undefined;
  if (!rawCustom && !rawProvider) return;

  const customAvatar = rawCustom ? toHttps(rawCustom) : undefined;
  const providerAvatar = rawProvider ? toHttps(rawProvider) : undefined;

  try {
    const { data, error } = await supabase.from("user").select("avatar_url").eq("id", user.id).maybeSingle();
    if (error || !data) return;

    //직접 올린 이미지는 항상 우선한다.
    //프로바이더 이미지는 DB가 비어 있을 때만 채운다 — 그렇지 않으면 custom_avatar_url 키가
    //생기기 전에 올린 커스텀 아바타가 소셜 기본 이미지로 덮여버린다.
    const next = customAvatar ?? (data.avatar_url ? null : providerAvatar);
    if (!next || data.avatar_url === next) return;

    await supabase.from("user").update({ avatar_url: next }).eq("id", user.id);
  } catch {
    //프로필 이미지 동기화 실패는 로그인 자체를 막을 이유가 없다
  }
};
