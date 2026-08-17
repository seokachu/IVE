import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RHFInput } from "@/components/common/RHFInput";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSaveCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { customerInfoSchema, CustomerInfoType } from "@/hooks/user";
import type { CustomerInfoFormProps } from "@/types/cart";
import { useSession } from "@/store/zustand";

const CustomerInfoForm = ({ initialData, defaultValues, onSuccess }: CustomerInfoFormProps) => {
  const session = useSession();
  const { mutate: saveCustomerInfo } = useSaveCustomerInfo();
  const queryClient = useQueryClient();

  const customerInfo = {
    name: initialData?.name || defaultValues?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || defaultValues?.email || "",
  };

  const form = useForm<CustomerInfoType>({
    mode: "onChange",
    resolver: zodResolver(customerInfoSchema),
    defaultValues: customerInfo,
  });

  const { isValid, isSubmitting } = form.formState;

  //전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, "");

    // 11자리가 넘어가면 잘라내기
    const trimmed = numbers.slice(0, 11);

    // 형식에 맞게 하이픈 추가
    if (trimmed.length === 11) {
      return trimmed.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (trimmed.length === 10) {
      return trimmed.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    return trimmed;
  };

  const onSubmit = (data: CustomerInfoType) => {
    if (!session?.user.id) return;

    const formattedData = {
      ...data,
      phone: formatPhoneNumber(data.phone),
    };

    // 기존 데이터와 새로운 데이터 비교
    const isDataChanged =
      initialData &&
      (initialData.name !== formattedData.name ||
        initialData.phone !== formattedData.phone ||
        initialData.email !== formattedData.email);

    // 데이터가 변경되지 않았으면
    if (initialData && !isDataChanged) {
      toast({
        title: "변경된 내용이 없습니다.",
      });
      onSuccess();
      return;
    }

    saveCustomerInfo(
      {
        user_id: session.user.id,
        ...formattedData,
      },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({
            queryKey: ["customerInfo", session.user.id],
          });

          toast({
            title: "주문자 정보가 저장되었습니다.",
          });
          onSuccess();
        },
        onError: (error) => {
          toast({
            title: "저장에 실패했습니다.",
            description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
        <ul className="flex flex-col gap-3.5">
          <li>
            <Label htmlFor="name" className="mb-1.5 block text-[13px] font-semibold">
              받는 분
            </Label>
            <RHFInput
              id="name"
              name="name"
              placeholder="이름을 입력해 주세요."
              messageClassName="text-xs py-1 px-1"
              className="h-11 w-full rounded-lg px-4"
              maxLength={25}
            />
          </li>
          <li>
            <Label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold">
              휴대폰 번호
            </Label>
            <RHFInput
              id="phone"
              name="phone"
              placeholder="하이픈(-) 없이 입력"
              pattern="[0-9]*"
              type="tel"
              inputMode="numeric"
              className="h-11 w-full rounded-lg px-4"
              messageClassName="text-xs py-1 px-1"
              maxLength={11}
            />
          </li>
          <li>
            <Label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold">
              이메일 주소
            </Label>
            <RHFInput
              id="email"
              name="email"
              placeholder="example@email.com"
              className="h-11 w-full rounded-lg px-4"
              messageClassName="text-xs py-1 px-1"
            />
          </li>
        </ul>
        <div className="mt-5 flex gap-2.5">
          <Button
            type="button"
            variant="plain"
            size="auto"
            onClick={() => onSuccess()}
            className="h-[42px] flex-1 rounded-full border border-gray-300 text-[13px] font-semibold text-gray-500 hover:bg-gray-50"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="plain"
            size="auto"
            disabled={!isValid || isSubmitting}
            className="h-[42px] flex-1 rounded-full bg-purple-300 text-[13px] font-bold text-white transition-colors hover:bg-purple-400"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerInfoForm;
