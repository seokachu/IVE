import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import { toast } from "./use-toast";

interface useAuthGuardProps {
  title?: string;
  description?: string;
}

const useAuthGuard = (options?: useAuthGuardProps) => {
  const session = useRecoilValue(sessionState);

  const defaultOptions = {
    title: "로그인이 필요합니다.",
    description: "로그인 페이지로 이동하여 로그인 해주세요.",
  };

  const customOptions = { ...defaultOptions, ...options };

  const checkAuth = () => {
    if (!session) {
      toast({
        title: customOptions.title,
        description: customOptions.description,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  return { checkAuth };
};

export default useAuthGuard;
