import { RHFInput } from "@/components/common/RHFInput";
import type { AddressLocationProps } from "@/types/mypage";

const AddressLocation = ({ searchAddress, detailAddress }: AddressLocationProps) => {
  return (
    <div className="mb-6">
      <fieldset>
        <legend className="mb-2 block text-[13px] font-semibold">
          배송지 주소
          <span className="translate-y-[3px] inline-block text-red ml-1">*</span>
        </legend>
        <div className="mb-2 flex justify-between gap-2">
          <div className="w-full">
            <RHFInput type="text" name="zonecode" messageClassName="pl-1 pt-1.5" placeholder="우편번호" readOnly />
          </div>
          <button
            type="button"
            onClick={searchAddress}
            className="h-12 shrink-0 rounded-lg bg-purple-300 px-4 text-[13px] font-bold text-white transition-colors hover:bg-purple-400"
          >
            주소 검색
          </button>
        </div>
        <RHFInput
          type="text"
          name="address"
          id="address"
          className="mb-2"
          placeholder="주소 검색을 눌러주세요"
          messageClassName="pl-1 pt-0"
          readOnly
        />
        <RHFInput
          type="text"
          name="detailAddress"
          id="detail-address"
          placeholder="상세 주소를 입력해주세요 (동/호수 등)"
          onChange={detailAddress}
        />
      </fieldset>
    </div>
  );
};

export default AddressLocation;
