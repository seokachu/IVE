"use client";

import { usePushSetting, useUpdatePushSetting } from "@/hooks/queries/usePushSetting";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/store/zustand";

//마이페이지 푸시 알림 수신 설정 토글
const PushSettingRow = () => {
  const session = useSession();
  const userId = session?.user?.id;
  const { data: setting } = usePushSetting(userId);
  const { mutate: updateSetting, isPending } = useUpdatePushSetting(userId);

  const hasToken = setting?.hasToken ?? false;
  const enabled = setting?.enabled ?? false;

  const handleToggle = () => {
    if (!hasToken || isPending) return;
    updateSetting(!enabled, {
      onSuccess: () => {
        toast({
          title: !enabled ? "푸시 알림을 켰습니다." : "푸시 알림을 껐습니다.",
        });
      },
      onError: () => {
        toast({ title: "알림 설정 변경에 실패했습니다.", variant: "destructive" });
      },
    });
  };

  //시안 기준: bg-gray-50 라운드 카드 + 퍼플 토글
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold">푸시 알림</p>
        <p className="mt-1 text-xs text-gray-400">
          {hasToken ? "댓글·답글 알림을 앱으로 받아요" : "앱에서 로그인하면 받을 수 있어요"}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="푸시 알림 수신 설정"
        disabled={!hasToken || isPending}
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
