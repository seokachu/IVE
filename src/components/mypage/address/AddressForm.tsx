import { useEffect, useState } from "react";
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
  useUpdateShippingAddress,
} from "@/hooks/queries/useShippingAddress";
import AddressRecipient from "./AddressRecipient";
import AddressLocation from "./AddressLocation";
import ContactInfo from "./ContactInfo";
import RequestInfo from "./RequestInfo";
import DefaultAddressCheckbox from "./DefaultAddressCheckbox";
import type { AddressChange, AddressFormProps } from "@/types";
import { RECIPIENT_DELIVERY_OPTIONS } from "@/utils/constants";

const AddressForm = ({
  mode = "create",
  initialData,
  onClose,
}: AddressFormProps) => {
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const [isAddress, setIsAddress] = useState(false);
  const [showRequested, setShowRequested] = useState(false);
  const { mutate: addShippingAddress } = useAddShippingAddress();
  const { mutate: updateAddress } = useUpdateShippingAddress();
  const { data: addresses } = useShippingAddresses(session?.user?.id);

  //첫 배송지 확인
  const isFirstAddress = !addresses || addresses.length === 0;

  //수정 모드일 때 초기값 설정
  const getInitialValues = () => {
    if (mode === "edit" && initialData) {
      const [phoneFirst, phoneMiddle, phoneLast] =
        initialData.recipient_phone.split("-");
      const savedRequest = initialData.request || "";

      //저장한 요청사항이 기본 옵션 중에 있는지 확인
      const isDefaultOption = RECIPIENT_DELIVERY_OPTIONS.some(
        (option) =>
          option.value === savedRequest && option.value !== "직접 입력"
      );

      // 직접 입력했지만 내용이 비어있거나 공백만 있는 경우
      if (savedRequest === "직접 입력" || !savedRequest) {
        return {
          recipient: initialData.recipient_name,
          zonecode: initialData.postal_code,
          address: initialData.address_line1,
          detailAddress: initialData.address_line2 || "",
          phoneFirst,
          phoneMiddle,
          phoneLast,
          request: RECIPIENT_DELIVERY_OPTIONS[0].value,
          customRequest: "",
          isDefault: initialData.is_default,
        };
      }

      return {
        recipient: initialData.recipient_name,
        zonecode: initialData.postal_code,
        address: initialData.address_line1,
        detailAddress: initialData.address_line2 || "",
        phoneFirst,
        phoneMiddle,
        phoneLast,
        request: isDefaultOption ? savedRequest : "직접 입력",
        customRequest: isDefaultOption ? "" : savedRequest,
        isDefault: initialData.is_default,
      };
    }

    return {
      ...userDefaultValues.myPageAddressValues,
      isDefault: isFirstAddress,
    };
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const savedRequest = initialData.request?.trim() || "";
      const isCustom = Boolean(
        savedRequest &&
          !RECIPIENT_DELIVERY_OPTIONS.some(
            (option) =>
              option.value === savedRequest && option.value !== "직접 입력"
          )
      );
      setShowRequested(isCustom);
    }
  }, [mode, initialData]);

  const form = useForm<AddressType>({
    mode: "onChange",
    resolver: zodResolver(myPageAddressSchema),
    defaultValues: getInitialValues(),
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
    const isDefaultOption = RECIPIENT_DELIVERY_OPTIONS.some(
      (option) => option.value === value && value !== "직접 입력"
    );
    const isCustomInput = value === "직접 입력";

    form.setValue("request", value);

    if (isDefaultOption || value === RECIPIENT_DELIVERY_OPTIONS[0].value) {
      form.setValue("customRequest", "");
    }

    setShowRequested(isCustomInput);
  };

  const handleSubmit = (data: AddressType) => {
    const baseAddressData = {
      user_id: session!.user.id,
      recipient_name: data.recipient,
      recipient_phone: `${data.phoneFirst}-${data.phoneMiddle}-${data.phoneLast}`,
      postal_code: data.zonecode,
      address_line1: data.address,
      address_line2: data.detailAddress || "",
      request: data.customRequest || data.request,
      is_default: isFirstAddress ? true : data.isDefault,
    };

    if (mode === "edit" && initialData) {
      //수정 시 created_at 제외
      updateAddress(
        {
          addressId: initialData.id,
          data: baseAddressData,
        },
        {
          onSuccess: () => {
            toast({ title: "배송지가 수정되었습니다." });
            onClose?.();
            push("/mypage/address");
          },
          onError: (error) => {
            toast({
              title: "배송지 수정에 실패했습니다.",
              description:
                error instanceof Error
                  ? error.message
                  : "알 수 없는 오류가 발생했습니다.",
            });
          },
        }
      );
    } else {
      //배송정보 추가 시 created_at 포함
      addShippingAddress(
        {
          ...baseAddressData,
          created_at: new Date().toISOString(),
        },
        {
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
        }
      );
    }
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
        <DefaultAddressCheckbox
          isDefaultAddress={mode === "edit" && initialData?.is_default}
        />
        <Button
          className="w-full py-2"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting
            ? "처리 중..."
            : mode === "edit"
            ? "수정하기"
            : "저장하기"}
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
