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
        />
      </li>
      <li>
        <OAuthButton
          onClick={() => handleOAuthLogin("google")}
          className="rounded-full border p-1 w-10 h-10"
          icon={FcGoogle}
          size={30}
          iconStyle="m-auto"
        />
      </li>
      <li>
        <OAuthButton
          onClick={() => handleOAuthLogin("github")}
          className="w-10 h-10"
          icon={FaGithub}
          size={38}
          iconStyle="translate-y-[2px]"
        />
      </li>
    </ul>
  );
};

export default OAuthLogin;
