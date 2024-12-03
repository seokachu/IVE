import { Tables } from "@/types/supabase";
import ActionButton from "../common/button/ActionButton";
import { FiMapPin } from "react-icons/fi";
import { useUpdateShippingAddress } from "@/hooks/queries/useShippingAddress";
import { toast } from "@/hooks/use-toast";

interface AddressListItems {
  item: Tables<"shipping_addresses">;
  onUpdate: () => void;
}

const AddressListItems = ({ item, onUpdate }: AddressListItems) => {
  const { mutate: updateAddress } = useUpdateShippingAddress();

  const onClickDefaultRecipient = () => {
    updateAddress(
      { addressId: item.id, data: { is_default: true, user_id: item.user_id } },
      {
        onSuccess: async () => {
          onUpdate();
          toast({
            title: "기본 배송지로 설정 되었습니다.",
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

  return (
    <li className="bg-gray-50 mb-5 rounded-lg p-4 lg:p-7 shadow-sm flex flex-col gap-2">
      <div className="flex gap-2 items-stretch">
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
            className="text-xs rounded-sm px-1 text-gray-600 hover:bg-silver-gray"
          >
            기본 배송지로 설정
          </ActionButton>
        )}
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
    </li>
  );
};

export default AddressListItems;
