import { RHFInput } from "@/components/common/RHFInput";
import { Label } from "@/components/ui/label";

const AddressRecipient = () => {
  return (
    <div className="mb-10">
      <Label htmlFor="recipient-name" className="block mb-2">
        받는 분<span className="translate-y-[3px] inline-block text-red ml-1">*</span>
      </Label>
      <RHFInput
        type="text"
        name="recipient"
        className="rounded-sm py-2 px-3"
        messageClassName="pl-2 pt-2"
        id="recipient-name"
        autoFocus
      />
    </div>
  );
};

export default AddressRecipient;
