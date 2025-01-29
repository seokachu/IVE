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
import { signInWithEmail } from "@/lib/supabase/auth";
import { addToWishList } from "@/lib/supabase/wishlist";
import { wishlistStorage } from "@/utils/wishlistStorage";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SignInEmail = () => {
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<LoginType>({
    mode: "onChange",
    resolver: zodResolver(userSchemas.loginSchema),
    defaultValues: userDefaultValues.loginDefaultValues,
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const handleSubmit = async (data: LoginType) => {
    try {
      const authData = await signInWithEmail(data.email, data.password);

      // 로그인 성공 후 로컬스토리지 찜 목록 동기화
      if (authData.user) {
        const localWishlist = wishlistStorage.getWishList();

        if (localWishlist.length > 0) {
          try {
            for (const item of localWishlist) {
              await addToWishList(authData.user.id, item.product_id as string);
            }
            localStorage.removeItem("wishlist");
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
          } catch (error) {
            if (error instanceof Error) {
              throw new Error(
                `찜 목록 동기화 중 오류가 발생했습니다. ${error.message}`
              );
            }
            throw error;
          }
        }
      }
      toast({
        title: "로그인 되었습니다.",
      });
      push("/");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          form.setError("email", {
            message: "이메일 또는 비밀번호가 일치하지 않습니다.",
          });
          form.setError("password", {
            message: "이메일 또는 비밀번호가 일치하지 않습니다.",
          });
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-3 w-full"
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
