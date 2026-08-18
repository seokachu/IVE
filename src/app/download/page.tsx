import type { Metadata } from "next";
import ApkDownload from "@/components/download/ApkDownload";

export const metadata: Metadata = {
  title: "IVE DIVE 앱 다운로드",
  description: "Android APK를 내려받아 설치합니다.",
};

//README의 QR·다운로드 링크가 여기를 가리킨다. 릴리스 파일을 직접 가리키지 않는 이유와
//인앱 브라우저 분기는 ApkDownload 주석 참고.
const DownloadPage = () => {
  return <ApkDownload />;
};

export default DownloadPage;
