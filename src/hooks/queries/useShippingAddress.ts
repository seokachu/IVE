import {
  deleteShippingAddress,
  getShippingAddress,
  getShippingAddresses,
  saveShippingAddress,
  updateShippingAddress,
} from "@/lib/supabase/addresses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/types/supabase";

type ShippingAddressUpdate =
  Database["public"]["Tables"]["shipping_addresses"]["Update"];

//배송지 목록 조회(여러개)
export const useShippingAddresses = (userId?: string) => {
  return useQuery({
    queryKey: ["shippingAddresses", userId],
    queryFn: () => getShippingAddresses(userId!),
    enabled: !!userId,
  });
};

//기본 목록 배송지 조회
export const useShippingAddress = (userId?: string) => {
  return useQuery({
    queryKey: ["shippingAddress", userId],
    queryFn: () => getShippingAddress(userId!),
    enabled: !!userId,
  });
};

//배송지 추가
export const useAddShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveShippingAddress,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shippingAddresses", variables.user_id],
      });
    },
  });
};

//배송지 삭제
export const useDeleteShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShippingAddress,
    onSuccess: (_, addressId) => {
      queryClient.invalidateQueries({
        queryKey: ["shippingAddresses", addressId],
      });
    },
  });
};

//배송지 수정
export const useUpdateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: string;
      data: ShippingAddressUpdate;
    }) => updateShippingAddress(addressId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shippingAddresses", variables.data.user_id],
      });
    },
  });
};
