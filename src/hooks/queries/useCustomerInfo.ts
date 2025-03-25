import { getCustomerInfo, saveCustomerInfo } from '@/lib/supabase/customer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCustomerInfo = (userId?: string) => {
  return useQuery({
    queryKey: ['customer', userId],
    queryFn: () => getCustomerInfo(userId!),
    enabled: !!userId,
  });
};

export const useSaveCustomerInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCustomerInfo,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['customer', variables.user_id],
      });
    },
  });
};
