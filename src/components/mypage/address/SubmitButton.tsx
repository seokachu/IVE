import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { AddressType } from "@/hooks/user";

interface SubmitButtonProps {
  mode: "create" | "edit";
  form: UseFormReturn<AddressType>;
}

export const SubmitButton = ({ mode, form }: SubmitButtonProps) => {
  const { isValid, isSubmitting } = form.formState;

  return (
    <Button
      className="w-full py-2"
      type="submit"
      disabled={!isValid || isSubmitting}
    >
      {isSubmitting ? "처리 중..." : mode === "edit" ? "수정하기" : "저장하기"}
    </Button>
  );
};
