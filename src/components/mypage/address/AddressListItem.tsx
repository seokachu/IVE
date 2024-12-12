import { Tables } from "@/types/supabase";
import ActionButton from "../../common/button/ActionButton";
import { FiMapPin } from "react-icons/fi";
import {
  useDeleteShippingAddress,
  useUpdateShippingAddress,
} from "@/hooks/queries/useShippingAddress";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { AddressListItems } from "@/types";
import { useState } from "react";
import AddressConfirmModal from "./AddressConfirmModal";
import AddressEditModal from "./AddressEditModal";

const AddressListItem = ({ item }: AddressListItems) => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { mutate: updateAddress } = useUpdateShippingAddress();
  const { mutate: deleteAddress } = useDeleteShippingAddress();

  const onClickDefaultRecipient = () => {
    updateAddress(
      { addressId: item.id, data: { is_default: true, user_id: item.user_id } },
      {
        onSuccess: () => {
          // 즉시 캐시 업데이트(낙관적 업데이트)
          queryClient.setQueryData<Tables<"shipping_addresses">[]>(
            ["shippingAddresses", item.user_id],
            (oldData) => {
              if (!oldData) return oldData;
              return oldData.map((address) => ({
                ...address,
                is_default: address.id === item.id,
              }));
            }
          );

          toast({
            title: "기본 배송지가 변경 되었습니다.",
            description: ``,
          });
        },
        onError: () => {
          toast({
            title: "기본 배송지 설정에 실패했습니다.",
            description: "다시 시도해주세요.",
          });
        },
      }
    );
  };

  //삭제 버튼 모달
  const onClickDelete = () => {
    setIsDeleteModalOpen(true);
  };

  //삭제 핸들러
  const handleDelete = () => {
    deleteAddress(
      { addressId: item.id, userId: item.user_id },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          toast({
            title: "배송지가 삭제 되었습니다.",
          });
        },
        onError: (error) => {
          console.error("Delete failed:", error);
          toast({
            title: "배송지 삭제에 실패했습니다.",
            description: "다시 시도해 주세요.",
          });
        },
      }
    );
  };

  //수정 버튼
  const onClickEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <li className="bg-gray-50 rounded-lg p-4 lg:p-7 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div
          className={`flex gap-2 items-stretch ${
            item.is_default ? "pointer-events-none" : ""
          }`}
        >
          <h3>{item.recipient_name}</h3>
          {item.is_default ? (
            <ActionButton
              variant="primary"
              className="text-xs rounded-sm px-1 cursor-auto"
              disabled
            >
              기본 배송지
            </ActionButton>
          ) : (
            <ActionButton
              onClick={onClickDefaultRecipient}
              variant="default"
              type="button"
              className="text-xs rounded-sm px-1 text-gray-600 hover:bg-silver-gray hover:text-primary"
            >
              기본 배송지로 설정
            </ActionButton>
          )}
        </div>
        <div className="flex gap-2 text-xs">
          <ActionButton
            onClick={onClickEdit}
            variant="default"
            className="border-none"
          >
            수정
          </ActionButton>
          <ActionButton
            onClick={onClickDelete}
            variant="default"
            className="border-none"
          >
            삭제
          </ActionButton>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 text-gray-600">
        <p className="flex items-center gap-1">
          <span>
            <FiMapPin />
          </span>
          <span>[{item.postal_code}]</span>
        </p>
        <p className="flex flex-col lg:flex-row">
          <span className="mr-1">{item.address_line1}</span>
          <span>{item.address_line2}</span>
        </p>
      </div>
      <p className="text-gray-600">{item.recipient_phone}</p>
      {item.request ? (
        <p className="text-xs text-gray-500">{item.request}</p>
      ) : null}
      {isDeleteModalOpen && (
        <AddressConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
      {isEditModalOpen && (
        <AddressEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          addressData={item}
        />
      )}
    </li>
  );
};

export default AddressListItem;
