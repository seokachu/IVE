import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/assets/images/logo_pink.svg";
import OAuthLogin from "./OAuthLogin";
import SignInEmail from "@/components/auth/modal/SignInEmail";

const RegularLogin = ({ redirectPath = "/" }: { redirectPath?: string }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="relative w-20 h-auto">
          <Image src={LogoImage} alt="logo image" className="fill" />
        </h2>
        <h3 className="text-2xl font-bold">로그인</h3>
        <p className="text-sm text-gray-500">다시 만나서 반가워요! 아이브의 모든 소식을 만나보세요</p>
      </div>
      <OAuthLogin />
      <div className="flex items-center gap-3 w-full" aria-hidden>
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">또는</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <SignInEmail redirectPath={redirectPath} />
      <p className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
        아직 계정이 없나요?
        <Link href="/signup" className="font-semibold text-purple-500">
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default RegularLogin;
