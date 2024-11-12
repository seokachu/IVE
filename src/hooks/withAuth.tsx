import { sessionState } from "@/store";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { toast } from "./use-toast";

//FIXME - 타입 제네릭으로 수정 예정
const withAuth = (WrappedComponent: any) => (props: any) => {
  const session = useRecoilValue(sessionState);

  useEffect(() => {
    if (!session) {
      toast({
        title: "로그인 후 이용 가능합니다.",
      });
    }
  }, [session]);

  if (!session) return null;

  return <WrappedComponent {...props} />;
};

export default withAuth;
