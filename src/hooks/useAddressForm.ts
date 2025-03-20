import { useEffect, useState } from 'react';
import { RECIPIENT_DELIVERY_OPTIONS } from '@/utils/constants';
import { AddressType, myPageAddressSchema, userDefaultValues } from './user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AddressChange, UseAddressFormProps } from '@/types/mypage';

export const useAddressForm = ({ mode, initialData, isFirstAddress }: UseAddressFormProps) => {
  const [isAddress, setIsAddress] = useState(false);
  const [showRequested, setShowRequested] = useState(false);

  const DIRECT_INPUT_OPTION =
    RECIPIENT_DELIVERY_OPTIONS.find((option) => option.value === '직접 입력')?.value || '직접 입력';

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const savedRequest = initialData.request?.trim() || '';
      const isCustom = Boolean(
        savedRequest &&
          !RECIPIENT_DELIVERY_OPTIONS.some((option) => option.value === savedRequest && option.value !== '직접 입력')
      );
      setShowRequested(isCustom);
    }
  }, [mode, initialData]);

  //수정모드 초기값 설정
  const getInitialValues = () => {
    if (mode === 'edit' && initialData) {
      const [phoneFirst, phoneMiddle, phoneLast] = initialData.recipient_phone.split('-');
      const savedRequest = initialData.request || '';

      //저장한 요청사항이 기본 옵션 중에 있는지 확인
      const isDefaultOption = RECIPIENT_DELIVERY_OPTIONS.some(
        (option) => option.value === savedRequest && option.value !== DIRECT_INPUT_OPTION
      );

      // 직접 입력했지만 내용이 비어있거나 공백만 있는 경우
      if (savedRequest === DIRECT_INPUT_OPTION || !savedRequest) {
        return {
          recipient: initialData.recipient_name,
          zonecode: initialData.postal_code,
          address: initialData.address_line1,
          detailAddress: initialData.address_line2 || '',
          phoneFirst,
          phoneMiddle,
          phoneLast,
          request: RECIPIENT_DELIVERY_OPTIONS[0].value,
          customRequest: '',
          isDefault: initialData.is_default,
        };
      }

      return {
        recipient: initialData.recipient_name,
        zonecode: initialData.postal_code,
        address: initialData.address_line1,
        detailAddress: initialData.address_line2 || '',
        phoneFirst,
        phoneMiddle,
        phoneLast,
        request: isDefaultOption ? savedRequest : DIRECT_INPUT_OPTION,
        customRequest: isDefaultOption ? '' : savedRequest,
        isDefault: initialData.is_default,
      };
    }

    return {
      ...userDefaultValues.myPageAddressValues,
      isDefault: isFirstAddress,
    };
  };

  const form = useForm<AddressType>({
    mode: 'onChange',
    resolver: zodResolver(myPageAddressSchema),
    defaultValues: getInitialValues(),
  });

  const handleRequestChange = (value: string) => {
    const isDefaultOption = RECIPIENT_DELIVERY_OPTIONS.some(
      (option) => option.value === value && value !== DIRECT_INPUT_OPTION
    );
    const isCustomInput = value === DIRECT_INPUT_OPTION;

    //직접 입력인 경우
    if (isCustomInput) {
      form.setValue('request', '');
    } else {
      form.setValue('request', value);
    }

    if (isDefaultOption || value === RECIPIENT_DELIVERY_OPTIONS[0].value) {
      form.setValue('customRequest', '');
    }

    setShowRequested(isCustomInput);
  };

  const handleAddressChange = ({ zonecode, fullAddress }: AddressChange) => {
    form.setValue('zonecode', zonecode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue('address', fullAddress, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('detailAddress', e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return {
    form,
    isAddress,
    showRequested,
    setIsAddress,
    handleRequestChange,
    handleAddressChange,
    handleDetailAddress,
    DIRECT_INPUT_OPTION,
  };
};
