import { getPushSetting, setPushEnabled } from "@/lib/supabase/pushToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//푸시 알림 설정 조회
export const usePushSetting = (userId?: string) => {
  return useQuery({
    queryKey: ["pushSetting", userId],
    queryFn: () => getPushSetting(userId!),
    enabled: !!userId,
  });
};

//푸시 알림 on/off 변경
export const useUpdatePushSetting = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => setPushEnabled(userId!, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pushSetting", userId] });
    },
  });
};
