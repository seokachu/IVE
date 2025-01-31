import { Label } from "@/components/ui/label";
import { RHFInput } from "@/components/common/RHFInput";
import { FaCheck } from "react-icons/fa";

interface DefaultAddressCheckboxProps {
  isDefaultAddress?: boolean;
}

const DefaultAddressCheckbox = ({
  isDefaultAddress,
}: DefaultAddressCheckboxProps) => {
  if (isDefaultAddress) {
    return (
      <div className="my-5">
        <Label className="text-sm text-gray-600 flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>현재 기본 배송지로 설정되어 있습니다.</span>
        </Label>
      </div>
    );
  }

  return (
    <div className="my-5 flex flex-wrap items-center gap-1">
      <Label
        htmlFor="defaultDelivery"
        className="text-sm flex items-center gap-1"
      >
        <RHFInput
          type="checkbox"
          name="isDefault"
          id="defaultDelivery"
          className="w-4 h-4"
        />
        기본 배송지로 저장
      </Label>
      <span className="text-gray-500 text-xs">
        &#40;첫 배송지는 자동으로 기본 배송지로 저장됩니다.&#41;
      </span>
    </div>
  );
};

export default DefaultAddressCheckbox;
