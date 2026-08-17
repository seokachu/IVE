import type { User } from "@supabase/supabase-js";

//소셜 재로그인 시 Supabase가 프로바이더의 name/avatar_url을 user_metadata에 다시 머지해 커스텀 값을 덮어쓴다.
//커스텀 값은 프로바이더가 쓰지 않는 nickname/custom_avatar_url 키에 저장하고, 여기서 우선 조회한다.
export const getDisplayName = (user?: User | null): string =>
  user?.user_metadata.nickname || user?.user_metadata.name || "";

export const getAvatarUrl = (user?: User | null): string | undefined =>
  user?.user_metadata.custom_avatar_url || user?.user_metadata.avatar_url || undefined;
