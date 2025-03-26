import OAuthButton from "@/components/common/button/OAuthButton";
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
    <ul className="flex gap-5 items-center justify-center mt-3">
      <li>
        <OAuthButton
          onClick={() => handleOAuthLogin("kakao")}
          className="bg-[#fee500] rounded-full border p-1 w-10 h-10"
          icon={IoChatbubble}
          size={20}
          iconStyle="m-auto"
          aria-label="카카오로 로그인하기 버튼"
        />
      </li>
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
  );
};

export default OAuthLogin;
