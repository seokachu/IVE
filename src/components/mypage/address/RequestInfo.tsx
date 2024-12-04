import { RHFInput } from "@/components/common/RHFInput";
import { RHFSelect } from "@/components/common/select/RHFSelect";
import { Label } from "@/components/ui/label";
import { RECIPIENT_DELIVERY_OPTIONS } from "@/utils/constants";

interface RequestInfoProps {
  request: (value: string) => void;
  showRequested: boolean;
}

const RequestInfo = ({ request, showRequested }: RequestInfoProps) => {
  return (
    <div>
      <Label htmlFor="request" className="block mb-2">
        요청사항 / 정보
      </Label>
      <RHFSelect
        name="request"
        options={RECIPIENT_DELIVERY_OPTIONS}
        className="w-full"
        onChange={request}
      />
      {showRequested ? (
        <RHFInput
          type="text"
          name="customRequest"
          id="request"
          className="rounded-sm py-2 px-3 my-2"
        />
      ) : (
        <p className="text-dark-gray text-sm mt-2 ml-2">
          공동 현관문 비밀번호가 있다면 &quot;직접 입력&quot; 선택 후 입력해
          주세요.
        </p>
      )}
    </div>
  );
};

export default RequestInfo;
