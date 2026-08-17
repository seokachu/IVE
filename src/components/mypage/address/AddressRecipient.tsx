import { RHFInput } from "@/components/common/RHFInput";
import { Label } from "@/components/ui/label";

const AddressRecipient = () => {
  return (
    <div className="mb-6">
      <Label htmlFor="recipient-name" className="mb-2 block text-[13px] font-semibold">
        받는 분<span className="translate-y-[3px] inline-block text-red ml-1">*</span>
      </Label>
      <RHFInput
        type="text"
        name="recipient"
        placeholder="이름을 입력해주세요"
        messageClassName="pl-1 pt-1.5"
        id="recipient-name"
        autoFocus
      />
    </div>
  );
};

export default AddressRecipient;
