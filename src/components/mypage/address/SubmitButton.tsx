import { UseFormReturn } from "react-hook-form";
import { AddressType } from "@/hooks/user";

interface SubmitButtonProps {
  mode: "create" | "edit";
  form: UseFormReturn<AddressType>;
}

export const SubmitButton = ({ mode, form }: SubmitButtonProps) => {
  const { isValid, isSubmitting } = form.formState;

  return (
    <button
      className="h-12 w-full rounded-full bg-purple-300 text-[15px] font-bold text-white transition-colors hover:bg-purple-400 disabled:opacity-50"
      type="submit"
      disabled={!isValid || isSubmitting}
    >
      {isSubmitting ? "처리 중..." : mode === "edit" ? "수정 완료" : "배송지 저장"}
    </button>
  );
};
