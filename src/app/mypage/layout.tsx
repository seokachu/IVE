import { myPageMetadata } from "@/metadata/mypage/myPageMetadata";
import MyPageLayout from "./MyPageLayout";

export const metadata = myPageMetadata;

const layout = ({ children }: { children: React.ReactNode }) => {
  return <MyPageLayout>{children}</MyPageLayout>;
};

export default layout;
