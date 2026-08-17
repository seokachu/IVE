"use client";
import { Tables } from "@/types/supabase";
import { useUpdateShippingAddress, useDeleteShippingAddress } from "@/hooks/queries/useShippingAddress";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EditDeleteActions from "@/components/common/EditDeleteActions";
import AddressEditModal from "./AddressEditModal";
import type { AddressListItems } from "@/types/mypage";

//배송지 카드 — 기본 배송지는 퍼플 보더+뱃지, 수정·삭제는 공통 필 (.pen "마이페이지 · 배송지 관리" 시안)
const AddressListItem = ({ item }: AddressListItems) => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { mutate: updateAddress } = useUpdateShippingAddress();
  const { mutate: deleteAddress } = useDeleteShippingAddress();

  const onClickDefaultRecipient = () => {
    updateAddress(
      { addressId: item.id, data: { is_default: true, user_id: item.user_id } },
      {
        onSuccess: () => {
          // 즉시 캐시 업데이트(낙관적 업데이트)
          queryClient.setQueryData<Tables<"shipping_addresses">[]>(["shippingAddresses", item.user_id], (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((address) => ({
              ...address,
              is_default: address.id === item.id,
            }));
          });

          toast({ title: "기본 배송지가 변경 되었습니다." });
        },
        onError: () => {
          toast({ title: "기본 배송지 설정에 실패했습니다.", description: "다시 시도해주세요." });
        },
      },
    );
  };

  //삭제 핸들러 — 확인 모달은 EditDeleteActions에 내장
  const handleDelete = () => {
    deleteAddress(
      { addressId: item.id, userId: item.user_id },
      {
        onSuccess: () => {
          toast({ title: "배송지가 삭제 되었습니다." });
        },
        onError: () => {
          toast({ title: "배송지 삭제에 실패했습니다.", description: "다시 시도해 주세요." });
        },
      },
    );
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 md:flex-row md:items-start md:justify-between ${
        item.is_default ? "border-purple-300" : "border-gray-200"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold">{item.recipient_name}</h3>
          {item.is_default ? (
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-500 dark:text-purple-300">
              기본 배송지
            </span>
          ) : (
            <button
              type="button"
              onClick={onClickDefaultRecipient}
              className="rounded-full border border-gray-300 px-2.5 py-1 text-[11px] font-semibold text-gray-500 transition-colors hover:bg-gray-50"
            >
              기본 배송지로 설정
            </button>
          )}
        </div>
        <p className="mt-2 text-[13px] text-gray-500">
          {item.recipient_name} · {item.recipient_phone}
        </p>
        <p className="mt-1 text-sm">
          [{item.postal_code}] {item.address_line1} {item.address_line2}
        </p>
        {item.request ? <p className="mt-1 text-xs text-gray-400">{item.request}</p> : null}
      </div>
      <EditDeleteActions
        size="md"
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDelete}
        confirmTitle="배송지를 삭제할까요?"
        confirmDescription="삭제한 배송지는 복구할 수 없어요."
      />
      {isEditModalOpen && (
        <AddressEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} addressData={item} />
      )}
    </div>
  );
};

export default AddressListItem;
