"use client";
import { Form } from "@/components/ui/form";
import { FaExclamationCircle } from "react-icons/fa";
import { RHFInput } from "@/components/common/RHFInput";
import { Button } from "@/components/ui/button";
import { SignUpType, userDefaultValues, userSchemas } from "@/hooks/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useEffect, useState } from "react";
import JSConfetti from "js-confetti";
import { toast } from "@/hooks/use-toast";
import { signUpEmail } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [jsConfetti, setJsConfetti] = useState<JSConfetti | null>(null);

  useEffect(() => {
    setJsConfetti(new JSConfetti());
  }, []);

  const form = useForm<SignUpType>({
    mode: "onChange",
    resolver: zodResolver(userSchemas.signUpSchema),
    defaultValues: userDefaultValues.signUpDefaultValues,
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const handleSubmit = async (data: SignUpType) => {
    try {
      await signUpEmail(data.email, data.password);

      toast({
        title: "회원가입이 완료되었습니다!",
      });

      push("/login");

      jsConfetti?.addConfetti({
        confettiColors: ["#ff9f87", "#FFFFFF", "#EB7FEC", "#E72424"],
        confettiRadius: 5,
        confettiNumber: 300,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
        });
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-3 sm:w-full md:w-[400px]"
        >
          <div className="relative">
            <FaUser className="absolute top-[17px] left-5" />
            <RHFInput
              type="email"
              name="email"
              placeholder="example@example.com"
              autoComplete="email"
              autoFocus
              className="pl-11"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-[17px] left-5" />
            <RHFInput
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호"
              maxLength={20}
              autoComplete="new-password"
              className="pl-11"
            />
            <span
              className="absolute right-4 top-[14px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEye size={24} color="#ccc" />
              ) : (
                <AiOutlineEyeInvisible size={24} color="#ccc" />
              )}
            </span>
          </div>
          <div className="relative">
            <FaLock className="absolute top-[17px] left-5" />
            <RHFInput
              type={showPasswordCheck ? "text" : "password"}
              name="passwordCheck"
              placeholder="비밀번호 확인"
              maxLength={20}
              autoComplete="new-password"
              className="pl-11"
            />
            <span
              className="absolute right-4 top-[14px] cursor-pointer"
              onClick={() => {
                setShowPasswordCheck(!showPasswordCheck);
              }}
            >
              {showPasswordCheck ? (
                <AiOutlineEye size={24} color="#ccc" />
              ) : (
                <AiOutlineEyeInvisible size={24} color="#ccc" />
              )}
            </span>
          </div>
          <p className="flex items-center gap-1 text-sm text-dark-gray pl-5">
            <FaExclamationCircle />
            비밀번호 영문, 숫자, 특수문자 포함 8-20자
          </p>
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
            className="w-full rounded-full mt-6 p-6 transition ease-in delay-300"
          >
            {isSubmitting ? "처리 중..." : "가입하기"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
