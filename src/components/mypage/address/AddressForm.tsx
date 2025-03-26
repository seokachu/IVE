import SearchAddress from "./SearchAddress";
import { Form } from "@/components/ui/form";
import { AddressType } from "@/hooks/user";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import { useShippingAddresses } from "@/hooks/queries/useShippingAddress";
import AddressRecipient from "./AddressRecipient";
import AddressLocation from "./AddressLocation";
import ContactInfo from "./ContactInfo";
import RequestInfo from "./RequestInfo";
import DefaultAddressCheckbox from "./DefaultAddressCheckbox";
import { useAddressForm } from "@/hooks/useAddressForm";
import { useAddressAPI } from "@/hooks/useAddressAPI";
import { SubmitButton } from "./SubmitButton";
import type { AddressFormProps } from "@/types/mypage";

const AddressForm = ({ mode = "create", initialData, onClose }: AddressFormProps) => {
  const session = useRecoilValue(sessionState);
  const { data: addresses } = useShippingAddresses(session?.user?.id);
  const isFirstAddress = !addresses || addresses.length === 0; //첫번째 배송지 등록 여부

  const {
    form,
    isAddress,
    showRequested,
    setIsAddress,
    handleRequestChange,
    handleAddressChange,
    handleDetailAddress,
  } = useAddressForm({ mode, initialData, isFirstAddress });

  const { addAddress, updateAddressData } = useAddressAPI();

  const onClickSearchAddress = () => {
    setIsAddress(true);
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

    //수정모드시 created_at 제외
    if (mode === "edit" && initialData) {
      updateAddressData(initialData.id, baseAddressData, onClose);
    } else {
      addAddress(baseAddressData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full lg:w-[500px]">
        <AddressRecipient />
        <AddressLocation searchAddress={onClickSearchAddress} detailAddress={handleDetailAddress} />
        <ContactInfo />
        <RequestInfo request={handleRequestChange} showRequested={showRequested} />
        <DefaultAddressCheckbox isDefaultAddress={mode === "edit" && initialData?.is_default} />
        <SubmitButton mode={mode} form={form} />
        {isAddress && <SearchAddress onClose={() => setIsAddress(false)} onAddressChange={handleAddressChange} />}
      </form>
    </Form>
  );
};

export default AddressForm;
