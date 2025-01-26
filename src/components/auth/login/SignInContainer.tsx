"use client";
import { useSearchParams } from "next/navigation";
import FirstLogin from "./FirstLogin";
import RegularLogin from "./RegularLogin";
import { useEffect } from "react";

const SignInContainer = () => {
  const searchParams = useSearchParams();
  const isFormSignup = searchParams.get("form") === "signup";

  useEffect(() => {
    return () => {
      //컴포넌트 언마운트 시 firstSignup 쿠키 삭제
      document.cookie = "firstSignup=; max-age=0; path=/;";
    };
  }, []);

  return (
    <section className="max-w-[500px] px-5">
      {isFormSignup ? <FirstLogin /> : <RegularLogin />}
    </section>
  );
};

export default SignInContainer;
