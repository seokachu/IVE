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

  return (
    <div className="flex items-center justify-between border-b pb-5 mb-5 px-5 lg:px-0">
      <div>
        <p className="text-sm font-medium">푸시 알림</p>
        <p className="text-xs text-[#495057] mt-1">
          {hasToken ? "댓글·답글 알림을 앱으로 받습니다" : "앱에서 로그인하면 받을 수 있어요"}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="푸시 알림 수신 설정"
        disabled={!hasToken || isPending}
        onClick={handleToggle}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
          enabled ? "bg-black" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default PushSettingRow;
