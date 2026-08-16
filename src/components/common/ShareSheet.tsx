"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Ellipsis, Link2, MessageCircle } from "lucide-react";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: { sendScrap: (options: { requestUrl: string }) => void };
    };
  }
}

//카카오 SDK 지연 로드 — 시트를 열 때 한 번만 삽입
const loadKakaoSdk = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Kakao) return resolve();
    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("카카오 SDK 로드 실패"));
    document.head.appendChild(script);
  });

//시안 기준: 카카오톡 · 링크 복사 · 더보기(네이티브 공유) + URL 바 공유 시트
const ShareSheet = ({ isOpen, onClose }: ShareSheetProps) => {
  const [url, setUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator.share === "function");
  }, [isOpen]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "링크가 복사되었습니다", variant: "success" });
      onClose();
    } catch {
      toast({ title: "링크 복사에 실패했습니다", variant: "destructive" });
    }
  };

  const shareKakao = async () => {
    if (!KAKAO_JS_KEY) {
      toast({
        title: "카카오톡 공유를 사용할 수 없습니다",
        description: "카카오 JavaScript 키 설정이 필요해요",
        variant: "warning",
      });
      return;
    }
    try {
      await loadKakaoSdk();
      if (!window.Kakao!.isInitialized()) window.Kakao!.init(KAKAO_JS_KEY);
      window.Kakao!.Share.sendScrap({ requestUrl: url });
    } catch {
      toast({ title: "카카오톡 공유에 실패했습니다", variant: "destructive" });
    }
  };

  const shareNative = async () => {
    try {
      await navigator.share({ title: document.title, url });
      onClose();
    } catch {
      //사용자가 공유 트레이를 닫은 경우 — 무시
    }
  };

  //URL 표시용 — 프로토콜 제거 후 잘라서 표기
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm rounded-3xl p-6">
        <DialogHeader className="items-start text-left">
          <DialogTitle className="text-base font-bold">공유하기</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-7 py-4">
          <Button variant="plain" size="auto" onClick={shareKakao} className="flex flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-kakao">
              <MessageCircle size={24} className="fill-[#191919] text-[#191919]" />
            </span>
            <span className="text-xs text-gray-500">카카오톡</span>
          </Button>
          <Button variant="plain" size="auto" onClick={copyLink} className="flex flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Link2 size={22} />
            </span>
            <span className="text-xs text-gray-500">링크 복사</span>
          </Button>
          {canNativeShare && (
            <Button variant="plain" size="auto" onClick={shareNative} className="flex flex-col items-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Ellipsis size={22} />
              </span>
              <span className="text-xs text-gray-500">더보기</span>
            </Button>
          )}
        </div>
        {/* min-w-0: 그리드 아이템이 nowrap URL 폭만큼 커지지 않게 축소 허용 */}
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-full bg-gray-50 py-2 pl-4 pr-2">
          <span className="min-w-0 flex-1 truncate text-xs text-gray-500">{displayUrl}</span>
          <Button
            variant="plain"
            size="auto"
            onClick={copyLink}
            className="shrink-0 rounded-full bg-purple px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-400"
          >
            복사
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSheet;
