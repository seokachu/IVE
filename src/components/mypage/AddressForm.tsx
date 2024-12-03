import { Label } from "@/components/ui/label";
import ActionButton from "../common/button/ActionButton";
import { useState } from "react";
import SearchAddress from "./SearchAddress";
import { PHONE_OPTIONS, RECIPIENT_DELIVERY_OPTIONS } from "@/utils/constants";
import { RHFInput } from "../common/RHFInput";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  AddressType,
  myPageAddressSchema,
  userDefaultValues,
} from "@/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { RHFSelect } from "../common/select/RHFSelect";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AddressChange {
  zonecode: string;
  fullAddress: string;
}

const AddressForm = () => {
  const { push } = useRouter();
  const [isAddress, setIsAddress] = useState(false);
  const [showRequested, setShowRequested] = useState(false);

  const form = useForm<AddressType>({
    mode: "onChange",
    resolver: zodResolver(myPageAddressSchema),
    defaultValues: userDefaultValues.myPageAddressValues,
  });

  const { isValid, isSubmitting } = form.formState;

  const onClickSearchAddress = () => {
    setIsAddress(true);
  };

  const handleAddressChange = ({ zonecode, fullAddress }: AddressChange) => {
    form.setValue("zonecode", zonecode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue("address", fullAddress, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("detailAddress", e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRequestChange = (value: string) => {
    setShowRequested(value === "직접 입력");
  };

  const handleSubmit = (data: AddressType) => {
    console.log(data);

    toast({ title: "배송지 정보가 저장되었습니다." });
    push("/mypage/address");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full lg:w-[500px]"
      >
        <div className="mb-10">
          <Label htmlFor="recipient-name" className="block mb-2">
            받는 분
            <span className="translate-y-[3px] inline-block text-red ml-1">
              *
            </span>
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
        <div className="mb-10">
          <fieldset>
            <legend className="block mb-2 text-sm">
              배송지 주소
              <span className="translate-y-[3px] inline-block text-red ml-1">
                *
              </span>
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
              <ActionButton
                onClick={onClickSearchAddress}
                type="button"
                variant="primary"
                className="w-1/5 text-sm h-[40px]"
              >
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
              onChange={handleDetailAddress}
            />
          </fieldset>
        </div>
        <div className="mb-10">
          <fieldset>
            <legend className="block mb-2 text-sm">
              휴대폰 번호
              <span className="translate-y-[3px] inline-block text-red ml-1">
                *
              </span>
            </legend>
            <div className="flex gap-3 items-start">
              <div className="w-1/3">
                <RHFSelect
                  name="phoneFirst"
                  options={PHONE_OPTIONS}
                  className="w-full"
                />
              </div>
              <span className="block translate-y-1/3">-</span>
              <div className="w-1/3">
                <RHFInput
                  type="text"
                  name="phoneMiddle"
                  className="rounded-sm py-2 px-3 w-full"
                  messageClassName="p-1 pt-1"
                  id="phone-middle"
                  maxLength={4}
                />
              </div>
              <span className="block translate-y-1/3">-</span>
              <div className="w-1/3">
                <RHFInput
                  type="text"
                  name="phoneLast"
                  id="phone-last"
                  className="rounded-sm py-2 px-3 w-full"
                  messageClassName="p-1 pt-1"
                  maxLength={4}
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div>
          <Label htmlFor="request" className="block mb-2">
            요청사항 / 정보
          </Label>
          <RHFSelect
            name="request"
            options={RECIPIENT_DELIVERY_OPTIONS}
            className="w-full"
            onChange={handleRequestChange}
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
        <div className="my-5">
          <Label htmlFor="defaultDelivery" className="flex items-center">
            <RHFInput
              type="checkbox"
              name="isDefault"
              id="defaultDelivery"
              className="w-[20px] h-[20px] mr-2"
            />
            기본 배송지로 저장
          </Label>
        </div>
        <Button
          className="w-full py-2"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "처리 중..." : "저장하기"}
        </Button>
        {isAddress && (
          <SearchAddress
            onClose={() => setIsAddress(false)}
            onAddressChange={handleAddressChange}
          />
        )}
      </form>
    </Form>
  );
};

export default AddressForm;
