"use client";
import SignInEmail from "@/components/auth/modal/SignInEmail";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";
import { useSearchParams } from "next/navigation";
import OAuthLogin from "./OAuthLogin";
import { useEffect, useState } from "react";
import JSConfetti from "js-confetti";

const SignInContainer = () => {
  const searchParams = useSearchParams();
  const [jsConfetti, setJsConfetti] = useState<JSConfetti | null>(null);
  const isFormSignup = searchParams.get("form") === "signup";

  useEffect(() => {
    setJsConfetti(new JSConfetti());
  }, []);

  jsConfetti?.addConfetti({
    confettiColors: ["#ff9f87", "#FFFFFF", "#EB7FEC", "#E72424"],
    confettiRadius: 5,
    confettiNumber: 300,
  });

  return (
    <section className="max-w-[500px] px-5">
      <div className="flex items-center justify-center flex-col mb-10">
        <h2 className="relative w-[100px] h-auto my-5">
          <Image src={LogoImage} alt="logo image" className="fill" />
        </h2>
        {isFormSignup ? (
          <>
            <h3 className="text-xl font-bold mb-1">
              회원이 되신 것을 축하드립니다!
            </h3>
            <p>함께 응원하고, 소중한 순간들을 나눠보세요.</p>
          </>
        ) : (
          <h3 className="text-xl font-bold mb-1">로그인</h3>
        )}
      </div>
      <SignInEmail />
      {!isFormSignup && (
        <div className="my-5">
          <p className="relative w-full text-dark-gray text-center text-xs before:absolute before:w-32 before:h-[1px] before:left-0 before:bg-silver-gray before:top-2/4 before:-translate-y-2/4 after:absolute after:w-32 after:h-[1px] after:right-0 after:bg-silver-gray after:top-2/4 after:-translate-y-2/4">
            또는
          </p>
          <OAuthLogin />
        </div>
      )}
    </section>
  );
};

export default SignInContainer;
