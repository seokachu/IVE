"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useShippingAddresses, useUpdateShippingAddress } from "@/hooks/queries/useShippingAddress";

interface ShippingAddressPickerProps {
  userId: string;
}

// 배송 정보 '변경' — 저장된 배송지 인라인 라디오 선택 (시안: 장바구니 · 정보 편집)
const ShippingAddressPicker = ({ userId }: ShippingAddressPickerProps) => {
  const { push } = useRouter();
  const { data: addresses } = useShippingAddresses(userId);
  const { mutate: updateAddress, isPending } = useUpdateShippingAddress();

  //라디오 선택 = 기본 배송지 변경 (RPC가 나머지 기본 설정을 해제)
  const handleSelect = (addressId: string, isDefault: boolean | null) => {
    if (isDefault || isPending) return;

    updateAddress(
      { addressId, data: { is_default: true, user_id: userId } },
      {
        onSuccess: () => {
          toast({
            title: "기본 배송지가 변경되었습니다.",
          });
        },
        onError: (error) => {
          toast({
            title: "배송지 변경에 실패했습니다.",
            description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="mt-3.5 flex flex-col gap-2.5">
      {addresses?.map((address) => (
        <button
          key={address.id}
          type="button"
          onClick={() => handleSelect(address.id, address.is_default)}
          disabled={isPending}
          className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
            address.is_default
              ? "border-purple-300 bg-purple-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span
            className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
              address.is_default ? "border-purple-300" : "border-gray-300"
            }`}
            aria-hidden
          >
            {address.is_default && <span className="h-2 w-2 rounded-full bg-purple-300" />}
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="flex items-center gap-2">
              <strong className="text-sm font-bold">{address.recipient_name}</strong>
              {address.is_default && (
                <span className="rounded-full bg-purple-300 px-2 py-0.5 text-[10px] font-bold text-white">
                  기본 배송지
                </span>
              )}
            </span>
            <span className="text-[13px] text-gray-500">{address.recipient_phone}</span>
            <span className="text-[13px] leading-relaxed text-gray-500">
              ({address.postal_code}) {address.address_line1} {address.address_line2}
            </span>
          </span>
        </button>
      ))}
      <Button
        variant="plain"
        size="auto"
        onClick={() => push("/mypage/address/new")}
        className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 text-[13px] font-semibold text-gray-500 hover:bg-gray-50"
      >
        <Plus size={14} />새 배송지 추가
      </Button>
      <p className="text-center text-[11px] text-gray-400">배송지 추가·수정은 마이페이지 배송지 관리에서 진행돼요</p>
    </div>
  );
};

export default ShippingAddressPicker;
