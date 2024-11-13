import { signOut } from "@/lib/supabase/auth";
import { toast } from "./use-toast";
import { useRouter } from "next/navigation";

const useSignOut = (onSuccess?: () => void) => {
  const { push } = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "로그아웃 되었습니다.",
      });
      onSuccess?.();
      push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "로그아웃 실패, 다시 시도해 주세요.",
        });
      }
    }
  };
  return { handleSignOut };
};

export default useSignOut;
