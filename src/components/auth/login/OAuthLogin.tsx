import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { oAuthLogin } from "@/lib/supabase/auth";
import GoogleIcon from "@/components/common/icons/GoogleIcon";
import { MessageCircle } from "lucide-react";
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
        <MessageCircle size={18} className="fill-current" />
        카카오로 시작하기
      </Button>
      <Button
        variant="outline"
        size="auto"
        onClick={() => handleOAuthLogin("google")}
        className="w-full h-12 rounded-lg text-base gap-2"
        aria-label="구글로 로그인하기 버튼"
      >
        <GoogleIcon size={20} />
        구글로 시작하기
      </Button>
    </div>
  );
};

export default OAuthLogin;
