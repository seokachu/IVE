import { RHFInput } from "@/components/common/RHFInput";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import type { DefaultAddressCheckboxProps } from "@/types/mypage";

const DefaultAddressCheckbox = ({ isDefaultAddress }: DefaultAddressCheckboxProps) => {
  if (isDefaultAddress) {
    return (
      <div className="my-6">
        <Label className="flex items-center gap-2 text-[13px] text-gray-500">
          <Check size={16} className="text-success" />
          <span>현재 기본 배송지로 설정되어 있습니다.</span>
        </Label>
      </div>
    );
  }

  return (
    <div className="my-6 flex flex-wrap items-center gap-2">
      <RHFInput type="checkbox" name="isDefault" id="defaultDelivery" />
      <Label htmlFor="defaultDelivery" className="text-[13px]">
        기본 배송지로 저장
      </Label>
      <span className="text-xs text-gray-400">&#40;첫 배송지는 자동으로 기본 배송지로 저장돼요&#41;</span>
    </div>
  );
};

export default DefaultAddressCheckbox;
