"use client";
import { useSearchParams } from "next/navigation";
import FirstLogin from "./FirstLogin";
import RegularLogin from "./RegularLogin";
import { useEffect } from "react";

const SignInContainer = () => {
  const searchParams = useSearchParams();
  const isFormSignup = searchParams.get("form") === "signup";
  //로그인 후 복귀 경로 — 내부 경로만 허용 (open redirect 방지)
  const rawRedirect = searchParams.get("redirect");
  const redirectPath = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/";

  useEffect(() => {
    return () => {
      //컴포넌트 언마운트 시 firstSignup 쿠키 삭제
      document.cookie = "firstSignup=; max-age=0; path=/;";
    };
  }, []);

  return (
    <section className="flex flex-col items-center w-[375px] max-w-[375px] px-5">
      {isFormSignup ? <FirstLogin /> : <RegularLogin redirectPath={redirectPath} />}
    </section>
  );
};

export default SignInContainer;
