import OAuthButton from "@/components/common/button/OAuthButton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { oAuthLogin } from "@/lib/supabase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";
import type { OAuthProvider } from "@/types";

const OAuthLogin = () => {
  const handleOAuthLogin = async (provider: OAuthProvider) => {
    try {
      //현재페이지 저장
      sessionStorage.setItem("redirectUrl", window.location.pathname + window.location.search);
      await oAuthLogin(provider);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        variant="kakao"
        size="auto"
        onClick={() => handleOAuthLogin("kakao")}
        className="w-full h-12 rounded-lg text-base gap-2"
        aria-label="카카오로 로그인하기 버튼"
      >
        <IoChatbubble size={18} />
        카카오로 시작하기
      </Button>
      <ul className="flex gap-4 items-center justify-center">
        <li>
          <OAuthButton
            onClick={() => handleOAuthLogin("google")}
            className="rounded-full border p-1 w-10 h-10"
            icon={FcGoogle}
            size={30}
            iconStyle="m-auto"
            aria-label="구글로 로그인하기 버튼"
          />
        </li>
        <li>
          <OAuthButton
            onClick={() => handleOAuthLogin("github")}
            className="w-10 h-10"
            icon={FaGithub}
            size={38}
            iconStyle="translate-y-[2px]"
            aria-label="깃허브로 로그인하기 버튼"
          />
        </li>
      </ul>
    </div>
  );
};

export default OAuthLogin;
