import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  useAddShippingAddress,
  useUpdateShippingAddress,
} from "@/hooks/queries/useShippingAddress";
import type { AddressData } from "@/types";

export const useAddressAPI = () => {
  const { push } = useRouter();
  const { mutate: addShippingAddress } = useAddShippingAddress();
  const { mutate: updateAddress } = useUpdateShippingAddress();

  const addAddress = (data: AddressData) => {
    addShippingAddress(
      {
        ...data,
        created_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          toast({ title: "배송지 정보가 저장되었습니다." });
          push("/mypage/address");
        },
        onError: (error) => {
          toast({
            title: "배송지 저장에 실패했습니다.",
            description:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  const updateAddressData = (
    addressId: string,
    data: AddressData,
    onClose?: () => void
  ) => {
    updateAddress(
      {
        addressId,
        data,
      },
      {
        onSuccess: () => {
          toast({ title: "배송지가 수정되었습니다." });
          onClose?.();
          push("/mypage/address");
        },
        onError: (error) => {
          toast({
            title: "배송지 수정에 실패했습니다.",
            description:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  return {
    addAddress,
    updateAddressData,
  };
};
