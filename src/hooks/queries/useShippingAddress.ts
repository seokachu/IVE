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

type DeleteAddressParams = {
  addressId: string;
  userId: string;
};

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
    mutationFn: ({ addressId, userId }: DeleteAddressParams) =>
      deleteShippingAddress(addressId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shippingAddresses", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["shippingAddress", variables.userId],
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
    onSuccess: async (updatedData, variables) => {
      console.log("Mutation succeeded with updated data:", updatedData);

      // 즉시 캐시 업데이트
      queryClient.setQueryData<any>(
        ["shippingAddresses", variables.data.user_id],
        (old: any) => {
          if (!old) return old;
          return old.map((address: any) =>
            address.id === variables.addressId ? updatedData : address
          );
        }
      );

      // 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: ["shippingAddresses", variables.data.user_id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["shippingAddress", variables.data.user_id],
      });
    },
  });
};
