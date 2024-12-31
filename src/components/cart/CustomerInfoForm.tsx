import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RHFInput } from "@/components/common/RHFInput";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSaveCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { customerInfoSchema, CustomerInfoType } from "@/hooks/user";
import type { CustomerInfoFormProps } from "@/types";

const CustomerInfoForm = ({
  initialData,
  defaultValues,
  onSuccess,
}: CustomerInfoFormProps) => {
  const session = useRecoilValue(sessionState);
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

  const onSubmit = (data: CustomerInfoType) => {
    if (!session?.user.id) return;

    // 기존 데이터와 새로운 데이터 비교
    const isDataChanged =
      initialData &&
      (initialData.name !== data.name ||
        initialData.phone !== data.phone ||
        initialData.email !== data.email);

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
        ...data,
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
            description:
              error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between border-b pb-4 mb-5">
        <h2 className="font-bold">주문자 정보</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ul className="flex flex-col gap-2">
            <li className="flex items-center">
              <Label htmlFor="name" className="w-[100px] text-gray-400">
                받는 분
              </Label>
              <div className="flex-1">
                <RHFInput
                  id="name"
                  name="name"
                  placeholder="이름을 입력해 주세요."
                  messageClassName="text-xs py-1 px-3"
                  className="rounded-sm py-0 px-4 w-full"
                />
              </div>
            </li>
            <li className="flex items-center">
              <Label htmlFor="phone" className="w-[100px] text-gray-400">
                휴대폰 번호
              </Label>
              <div className="flex-1">
                <RHFInput
                  id="phone"
                  name="phone"
                  placeholder="010-0000-0000"
                  className="rounded-sm py-0 px-4 w-full"
                  messageClassName="text-xs py-1 px-3"
                />
              </div>
            </li>
            <li className="flex items-center">
              <Label htmlFor="email" className="w-[100px] text-gray-400">
                이메일 주소
              </Label>
              <div className="flex-1">
                <RHFInput
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  className="rounded-sm py-0 px-4 w-full"
                  messageClassName="text-xs py-1 px-3"
                />
              </div>
            </li>
          </ul>
          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              className="flex-1 py-2 text-xs"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess()}
              className="flex-1 py-2 text-xs"
            >
              취소
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomerInfoForm;
