import { RHFInput } from "@/components/common/RHFInput";
import { RHFSelect } from "@/components/common/select/RHFSelect";
import { PHONE_OPTIONS } from "@/utils/constants";
import { Label } from "@radix-ui/react-label";

const ContactInfo = () => {
  return (
    <div className="mb-10">
      <fieldset>
        <legend className="block mb-2 text-sm">
          휴대폰 번호
          <span className="translate-y-[3px] inline-block text-red ml-1">*</span>
        </legend>
        <div className="flex gap-3 items-start">
          <div className="w-1/3">
            <RHFSelect
              name="phoneFirst"
              options={PHONE_OPTIONS}
              className="w-full text-base lg:text-sm"
              aria-label="휴대폰 앞자리 선택"
            />
          </div>
          <span className="block translate-y-1/3">&#45;</span>
          <div className="w-1/3">
            <Label htmlFor="phone-middle">
              <RHFInput
                type="tel"
                name="phoneMiddle"
                className="rounded-sm py-2 px-3 w-full"
                messageClassName="p-1 pt-1"
                pattern="[0-9]*"
                inputMode="numeric"
                id="phone-middle"
                maxLength={4}
              />
            </Label>
          </div>
          <span className="block translate-y-1/3">&#45;</span>
          <div className="w-1/3">
            <Label htmlFor="phone-last">
              <RHFInput
                type="tel"
                name="phoneLast"
                id="phone-last"
                pattern="[0-9]*"
                inputMode="numeric"
                className="rounded-sm py-2 px-3 w-full"
                messageClassName="p-1 pt-1"
                maxLength={4}
              />
            </Label>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ContactInfo;
