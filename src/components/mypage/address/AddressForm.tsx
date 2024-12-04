import { useState } from "react";
import SearchAddress from "./SearchAddress";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  AddressType,
  myPageAddressSchema,
  userDefaultValues,
} from "@/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import {
  useAddShippingAddress,
  useShippingAddresses,
} from "@/hooks/queries/useShippingAddress";
import AddressRecipient from "./AddressRecipient";
import AddressLocation from "./AddressLocation";
import ContactInfo from "./ContactInfo";
import RequestInfo from "./RequestInfo";
import DefaultAddressCheckbox from "./DefaultAddressCheckbox";
import type { AddressChange } from "@/types";

const AddressForm = () => {
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const [isAddress, setIsAddress] = useState(false);
  const [showRequested, setShowRequested] = useState(false);
  const { mutate: addShippingAddress } = useAddShippingAddress();
  const { data: addresses } = useShippingAddresses(session?.user?.id);

  //첫 배송지 확인
  const isFirstAddress = !addresses || addresses.length === 0;

  const form = useForm<AddressType>({
    mode: "onChange",
    resolver: zodResolver(myPageAddressSchema),
    defaultValues: {
      ...userDefaultValues.myPageAddressValues,
      isDefault: isFirstAddress,
    },
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

  //제출 form
  const handleSubmit = (data: AddressType) => {
    const addressData = {
      user_id: session!.user.id,
      recipient_name: data.recipient,
      recipient_phone: `${data.phoneFirst}-${data.phoneMiddle}-${data.phoneLast}`,
      postal_code: data.zonecode,
      address_line1: data.address,
      address_line2: data.detailAddress || "",
      request: data.customRequest || data.request,
      is_default: isFirstAddress ? true : data.isDefault,
      created_at: new Date().toISOString(),
    };

    addShippingAddress(addressData, {
      onSuccess: () => {
        toast({ title: "배송지 정보가 저장되었습니다." });
        push("/mypage/address");
      },
      onError: (error) => {
        toast({
          title: "배송지 저장에 실패했습니다.",
          description:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full lg:w-[500px]"
      >
        <AddressRecipient />
        <AddressLocation
          searchAddress={onClickSearchAddress}
          detailAddress={handleDetailAddress}
        />
        <ContactInfo />
        <RequestInfo
          request={handleRequestChange}
          showRequested={showRequested}
        />
        <DefaultAddressCheckbox />
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
