"use client";
import SignInEmail from "@/components/auth/modal/SignInEmail";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";
import { useSearchParams } from "next/navigation";

const SignInContainer = () => {
  const searchParams = useSearchParams();
  const isFormSignup = searchParams.get("form") === "signup";

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
    </section>
  );
};

export default SignInContainer;
