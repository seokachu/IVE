"use client";
import { COLORS } from "@/utils/constants";
import { Form } from "@/components/ui/form";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { RHFInput } from "@/components/common/RHFInput";
import { Button } from "@/components/ui/button";
import { SignUpType, userDefaultValues, userSchemas } from "@/hooks/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { signUpEmail } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  useEffect(() => {
    router.prefetch("/login?form=signup");
  }, [router]);

  const form = useForm<SignUpType>({
    mode: "onChange",
    resolver: zodResolver(userSchemas.signUpSchema),
    defaultValues: userDefaultValues.signUpDefaultValues,
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const handleSubmit = async (data: SignUpType) => {
    try {
      await signUpEmail(data.email, data.password);
      localStorage.setItem("loginEffect", "true");
      document.cookie = "firstSignup=true; path=/; max-age=300";

      router.push("/login?form=signup");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "회원가입에 실패했습니다.",
          description: "이미 등록된 이메일 입니다.",
          variant: "destructive",
        });
        throw error.message;
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-email" className="text-sm font-semibold text-gray-900">
              이메일
            </label>
            <RHFInput
              id="signup-email"
              type="email"
              name="email"
              placeholder="example@example.com"
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password" className="text-sm font-semibold text-gray-900">
              비밀번호
            </label>
            <div className="relative">
              <RHFInput
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호"
                maxLength={20}
                autoComplete="new-password"
                className="pr-12"
              />
              <Button
                variant="plain"
                size="auto"
                className="absolute right-4 top-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPassword ? (
                  <Eye size={24} color={COLORS.gray300} />
                ) : (
                  <EyeOff size={24} color={COLORS.gray300} />
                )}
              </Button>
            </div>
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <AlertCircle />
              비밀번호 영문, 숫자, 특수문자 포함 8-20자
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password-check" className="text-sm font-semibold text-gray-900">
              비밀번호 확인
            </label>
            <div className="relative">
              <RHFInput
                id="signup-password-check"
                type={showPasswordCheck ? "text" : "password"}
                name="passwordCheck"
                placeholder="비밀번호 확인"
                maxLength={20}
                autoComplete="new-password"
                className="pr-12"
              />
              <Button
                variant="plain"
                size="auto"
                className="absolute right-4 top-3"
                onClick={() => {
                  setShowPasswordCheck(!showPasswordCheck);
                }}
                aria-label={showPasswordCheck ? "비밀번호 숨기기" : "비밀번호 표시"}
              >
                {showPasswordCheck ? (
                  <Eye size={24} color={COLORS.gray300} />
                ) : (
                  <EyeOff size={24} color={COLORS.gray300} />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={!isValid || !isDirty || isSubmitting} className="w-full h-12 rounded-lg text-base mt-2">
            {isSubmitting ? "처리 중..." : "가입하기"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUpForm;
