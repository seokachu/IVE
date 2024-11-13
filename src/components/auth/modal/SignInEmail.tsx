"use client";
import { Form } from "@/components/ui/form";
import { RHFInput } from "@/components/common/RHFInput";
import { Button } from "@/components/ui/button";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { LoginType, userDefaultValues, userSchemas } from "@/hooks/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const SignInEmail = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginType>({
    mode: "onChange",
    resolver: zodResolver(userSchemas.loginSchema),
    defaultValues: userDefaultValues.loginDefaultValues,
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const handleSubmit = (data: LoginType) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-3 sm:w-[275px] md:w-[375px]"
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
        <Button
          type="submit"
          disabled={!isValid || !isDirty || isSubmitting}
          className="w-full rounded-full mt-6 p-6 transition ease-in delay-300"
        >
          {isSubmitting ? "처리 중..." : "로그인"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInEmail;
