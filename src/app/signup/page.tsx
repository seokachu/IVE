import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/images/logo_pink.svg";
import SignUpForm from "@/components/auth/signup/SignUpForm";
import { signUpMetadata } from "@/metadata/signup/signupMetadata";

export const metadata = signUpMetadata;

const SignUp = () => {
  return (
    <main className="w-full h-[100dvh] lg:h-screen flex items-center justify-center">
      <section className="w-[375px] max-w-[375px] px-5">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="relative w-9 h-auto">
            <Image src={LogoImage} alt="logo image" className="fill" />
          </h2>
          <h3 className="text-2xl font-bold">회원가입</h3>
          <p className="text-sm text-gray-500">가입하고 아이브 팬 커뮤니티를 시작해 보세요</p>
        </div>
        <SignUpForm />
        <p className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mt-6">
          이미 계정이 있나요?
          <Link href="/login" className="font-semibold text-purple-500">
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
};

export default SignUp;
