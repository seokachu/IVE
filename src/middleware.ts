import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    const session = await supabase.auth.getSession();

    // mypage 경로 보호
    if (request.nextUrl.pathname.startsWith("/mypage")) {
      if (!session.data.session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    //결제성공 & 실패페이지 경로
    if (
      request.nextUrl.pathname.startsWith("/payment/success") ||
      request.nextUrl.pathname.startsWith("/payment/fail")
    ) {
      //로그인 체크
      if (!session.data.session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      //orderId 파라미터 체크
      const orderId = request.nextUrl.searchParams.get("orderId");
      if (!orderId) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 로그인 페이지
    if (request.nextUrl.pathname === "/login") {
      if (session.data.session) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (
        request.nextUrl.searchParams.get("form") === "signup" &&
        !request.cookies.get("firstSignup")
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Middleware Error : ${error.message}`);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/mypage/:path*", "/login", "/payment/success", "/payment/fail"],
};
