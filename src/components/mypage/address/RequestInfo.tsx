import { RHFInput } from "@/components/common/RHFInput";
import { RHFSelect } from "@/components/common/select/RHFSelect";
import { Label } from "@/components/ui/label";
import { RECIPIENT_DELIVERY_OPTIONS } from "@/utils/constants";
import type { RequestInfoProps } from "@/types/mypage";

const RequestInfo = ({ request, showRequested }: RequestInfoProps) => {
  return (
    <div className="mb-6">
      <Label htmlFor="request" className="mb-2 block text-[13px] font-semibold">
        배송 요청사항
      </Label>
      <RHFSelect
        name="request"
        options={RECIPIENT_DELIVERY_OPTIONS}
        className="w-full"
        onChange={request}
        aria-label="요청사항 선택"
      />
      {showRequested ? (
        <RHFInput type="text" name="customRequest" id="request" className="my-2" placeholder="요청사항을 입력해주세요" />
      ) : (
        <p className="mt-2 pl-1 text-xs text-gray-400">
          공동 현관문 비밀번호가 있다면 &quot;직접 입력&quot; 선택 후 입력해 주세요.
        </p>
      )}
    </div>
  );
};

export default RequestInfo;
