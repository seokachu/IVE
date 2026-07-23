import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    let res = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            res = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // mypage 경로 보호
    if (request.nextUrl.pathname.startsWith("/mypage")) {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    //결제성공 & 실패페이지 경로
    if (
      request.nextUrl.pathname.startsWith("/payment/success") ||
      request.nextUrl.pathname.startsWith("/payment/fail")
    ) {
      //로그인 체크
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      //orderId 파라미터 체크
      const orderId = request.nextUrl.searchParams.get("orderId");
      if (!orderId) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    //회원가입 페이지
    if (request.nextUrl.pathname === "/signup") {
      if (user) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 로그인 페이지
    if (request.nextUrl.pathname === "/login") {
      if (user) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (request.nextUrl.searchParams.get("form") === "signup" && !request.cookies.get("firstSignup")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Proxy Error : ${error.message}`);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/mypage/:path*", "/login", "/signup", "/payment/success", "/payment/fail"],
};
