import ActionButton from "@/components/common/button/ActionButton";
import { RHFInput } from "@/components/common/RHFInput";
import type { AddressLocationProps } from "@/types/mypage";

const AddressLocation = ({ searchAddress, detailAddress }: AddressLocationProps) => {
  return (
    <div className="mb-10">
      <fieldset>
        <legend className="block mb-2 text-sm">
          배송지 주소
          <span className="translate-y-[3px] inline-block text-red ml-1">*</span>
        </legend>
        <div className="flex gap-2 justify-between mb-2">
          <div className="w-full">
            <RHFInput
              type="text"
              name="zonecode"
              className="rounded-sm py-2 px-4 w-full"
              messageClassName="pl-2"
              placeholder="우편번호"
              readOnly
            />
          </div>
          <ActionButton onClick={searchAddress} type="button" variant="primary" className="w-2/6 text-sm h-[40px]">
            주소 검색
          </ActionButton>
        </div>
        <RHFInput
          type="text"
          name="address"
          id="address"
          className="rounded-sm py-2 px-3 mb-2"
          placeholder="기본주소"
          messageClassName="pl-2 pt-0"
          readOnly
        />
        <RHFInput
          type="text"
          name="detailAddress"
          id="detail-address"
          className="rounded-sm py-2  px-3"
          placeholder="나머지 주소 (선택 입력 가능)"
          onChange={detailAddress}
        />
      </fieldset>
    </div>
  );
};

export default AddressLocation;
