"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

interface LoginLinkProps {
  className?: string;
  children?: React.ReactNode;
}

//로그인 페이지로 이동하면서 현재 경로를 redirect 파라미터로 전달 — 로그인 후 원래 페이지로 복귀
const LoginLink = forwardRef<HTMLAnchorElement, LoginLinkProps>(({ className, children = "로그인" }, ref) => {
  const pathname = usePathname();
  const needsRedirect = pathname !== "/" && !pathname.startsWith("/login") && !pathname.startsWith("/signup");
  const href = needsRedirect ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";

  return (
    <Link ref={ref} href={href} className={className}>
      {children}
    </Link>
  );
});
LoginLink.displayName = "LoginLink";

export default LoginLink;
