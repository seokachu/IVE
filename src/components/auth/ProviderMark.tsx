import type { User } from "@supabase/supabase-js";
import { cn } from "@/utils/utils";

export type SigninProvider = "google" | "kakao";

/**
 * 마지막으로 로그인한 소셜 제공자. (vidding-re 동일 규칙)
 *
 * `app_metadata.provider`는 **처음 가입한** 제공자라, 같은 이메일로 계정이
 * 연결된 사용자가 다른 쪽으로 로그인하면 어긋난다. identity의 마지막 로그인
 * 시각을 비교해 실제로 방금 쓴 쪽을 고른다. 일반 이메일 가입이면 null.
 */
export const getSigninProvider = (user?: User | null): SigninProvider | null => {
  if (!user) return null;

  const latest = [...(user.identities ?? [])].sort((a, b) =>
    (b.last_sign_in_at ?? "").localeCompare(a.last_sign_in_at ?? ""),
  )[0]?.provider;

  const provider = latest ?? user.app_metadata.provider;
  return provider === "google" || provider === "kakao" ? provider : null;
};

//제공자 심볼 — vidding-re의 로그인 마크 패스를 그대로 옮겼다
export const KakaoMark = ({ size = 19 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path
      fill="#191600"
      d="M12 3c-5.52 0-10 3.48-10 7.8 0 2.78 1.86 5.22 4.66 6.6-0.15 0.53-0.96 3.32-1.1 3.94 0 0-0.02 0.18 0.09 0.25 0.11 0.07 0.25 0.02 0.25 0.02 0.33-0.05 3.83-2.5 4.43-2.93 0.55 0.08 1.11 0.12 1.67 0.12 5.52 0 10-3.48 10-7.8s-4.48-8-10-8z"
    />
  </svg>
);

export const GoogleMark = ({ size = 19 }: { size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M45.12 24.5c0-1.56-0.14-3.06-0.4-4.5h-20.72v8.51h11.84c-0.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
    />
    <path
      fill="#34A853"
      d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07h-7.35v5.7c3.62 7.19 11.06 12.12 19.66 12.12z"
    />
    <path
      fill="#FBBC05"
      d="M11.69 28.18c-0.44-1.32-0.69-2.73-0.69-4.18s0.25-2.86 0.69-4.18v-5.7h-7.35c-1.49 2.97-2.34 6.33-2.34 9.88s0.85 6.91 2.34 9.88l7.35-5.7z"
    />
    <path
      fill="#EA4335"
      d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31c-3.81-3.55-8.79-5.73-14.72-5.73-8.6 0-16.04 4.93-19.66 12.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
    />
  </svg>
);

/**
 * 어느 계정으로 로그인했는지 알리는 심볼. (일반 이메일 가입은 표시 없음)
 *
 * 카카오 마크는 검정 말풍선뿐이라 노란 원 위에 올려야 카카오로 읽힌다.
 * 구글 마크는 색이 곧 정체라 흰 원에 테두리만 두른다.
 */
const ProviderBadge = ({ provider, size = "sm" }: { provider: SigninProvider; size?: "sm" | "md" }) => (
  <span
    className={cn(
      "grid shrink-0 place-items-center rounded-full",
      size === "md" ? "size-5" : "size-4",
      provider === "kakao" ? "bg-[#FEE500]" : "border border-gray-300 bg-white",
    )}
  >
    {provider === "kakao" ? (
      <KakaoMark size={size === "md" ? 13 : 10} />
    ) : (
      <GoogleMark size={size === "md" ? 13 : 10} />
    )}
    <span className="sr-only">{provider === "kakao" ? "카카오로 로그인" : "구글로 로그인"}</span>
  </span>
);

export default ProviderBadge;
