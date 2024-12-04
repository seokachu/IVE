import { Label } from "@/components/ui/label";
import { RHFInput } from "@/components/common/RHFInput";

const DefaultAddressCheckbox = () => {
  return (
    <div className="my-5">
      <Label htmlFor="defaultDelivery" className="flex items-center">
        <RHFInput
          type="checkbox"
          name="isDefault"
          id="defaultDelivery"
          className="w-[20px] h-[20px] mr-2"
        />
        기본 배송지로 저장
        <span className="ml-1 text-gray-500 text-xs">
          &#40;첫 배송지는 자동으로 기본 배송지로 저장됩니다.&#41;
        </span>
      </Label>
    </div>
  );
};

export default DefaultAddressCheckbox;
