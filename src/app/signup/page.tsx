"use client";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";
import SignupForm from "@/components/auth/signup/SignupForm";
import SignIn from "@/components/auth/modal/SignIn";
import { useState } from "react";
import SignInEmail from "@/components/auth/modal/SignInEmail";

const SignUp = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);

  return (
    <section className="w-full h-screen flex items-center justify-center">
      {!isLoginMode ? (
        <div className="max-w-[500px] px-5">
          <div className="flex justify-center items-center flex-col gap-3 mb-12">
            <h2 className="relative w-[100px] h-auto">
              <Image src={LogoImage} alt="logo image" className="fill" />
            </h2>
            <h3 className="text-xl font-bold">회원가입</h3>
          </div>
          <SignupForm setIsLoginMode={setIsLoginMode} />
          <div className="text-dark-gray text-sm flex items-center gap-2 justify-center mt-5 ">
            <p>이미 회원이신가요?</p>
            <div className="text-font-color">
              <SignIn
                title="로그인하기"
                className="underline underline-offset-1"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[500px] px-5">
          <div className="flex items-center justify-center flex-col mb-10">
            <h2 className="relative w-[100px] h-auto my-5">
              <Image src={LogoImage} alt="logo image" className="fill" />
            </h2>
            <h3 className="text-xl font-bold mb-1">
              회원이 되신 것을 축하드립니다!
            </h3>
            <p>함께 응원하고, 소중한 순간들을 나눠보세요.</p>
          </div>
          <SignInEmail />
        </div>
      )}
    </section>
  );
};

export default SignUp;
