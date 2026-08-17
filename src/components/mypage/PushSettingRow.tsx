"use client";

import { useState, useSyncExternalStore } from "react";
import { usePushSetting, useUpdatePushSetting } from "@/hooks/queries/usePushSetting";
import { isWebPushSupported, subscribeWebPush } from "@/lib/push/webPush";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/store/zustand";

const subscribeNoop = () => () => {};

//마이페이지 푸시 알림 수신 설정 토글 — 앱(Expo)과 웹(브라우저) 알림을 하나의 스위치로 관리
const PushSettingRow = () => {
  const session = useSession();
  const userId = session?.user?.id;
  const { data: setting } = usePushSetting(userId);
  const { mutate: updateSetting, isPending } = useUpdatePushSetting(userId);
  //웹 푸시 지원 여부는 브라우저 API라 서버 스냅샷은 false로 (SSR 하이드레이션 불일치 방지)
  //앱 WebView에서는 네이티브(Expo) 푸시가 담당하므로 웹 구독을 만들지 않는다
  const webPushReady = useSyncExternalStore(
    subscribeNoop,
    () => isWebPushSupported() && !window.__IVE_PUSH__,
    () => false,
  );
  const [isSubscribing, setIsSubscribing] = useState(false);

  const hasToken = setting?.hasToken ?? false;
  const enabled = setting?.enabled ?? false;
  const canToggle = hasToken || webPushReady;

  const handleToggle = async () => {
    if (!userId || !canToggle || isPending || isSubscribing) return;

    if (enabled) {
      updateSetting(false, {
        onSuccess: () => toast({ title: "푸시 알림을 껐습니다." }),
        onError: () => toast({ title: "알림 설정 변경에 실패했습니다.", variant: "destructive" }),
      });
      return;
    }

    //켜기: 웹 브라우저면 이 브라우저를 수신 기기로 먼저 등록 (알림 권한 요청 포함)
    if (webPushReady) {
      setIsSubscribing(true);
      try {
        await subscribeWebPush(userId);
      } catch {
        toast({
          title: "브라우저 알림 권한이 필요해요.",
          description: "주소창 옆 사이트 설정에서 알림을 허용한 뒤 다시 켜 주세요.",
          variant: "destructive",
        });
        setIsSubscribing(false);
        return;
      }
      setIsSubscribing(false);
    }

    updateSetting(true, {
      onSuccess: () => toast({ title: "푸시 알림을 켰습니다." }),
      onError: () => toast({ title: "알림 설정 변경에 실패했습니다.", variant: "destructive" }),
    });
  };

  const description = enabled
    ? "댓글·답글 알림을 웹과 앱으로 받아요"
    : webPushReady
      ? "켜면 이 브라우저와 앱에서 알림을 받아요"
      : hasToken
        ? "켜면 앱에서 알림을 받아요"
        : "이 브라우저는 알림을 지원하지 않아요. 앱에서 로그인하면 받을 수 있어요";

  //시안 기준: bg-gray-50 라운드 카드 + 퍼플 토글
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold">푸시 알림</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="푸시 알림 수신 설정"
        disabled={!canToggle || isPending || isSubscribing}
        onClick={handleToggle}
        className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
          enabled ? "bg-purple-300" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${
            enabled ? "translate-x-[20px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};

export default PushSettingRow;
