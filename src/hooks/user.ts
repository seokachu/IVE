import { z } from "zod";

// extractDefaultValues 함수 구현
function extractDefaultValues<T extends z.ZodTypeAny>(
  schema: T
): Partial<z.infer<T>> {
  const parsedData: Partial<z.infer<T>> = {};

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;

    for (const key in shape) {
      if (shape[key] instanceof z.ZodString) {
        parsedData[key as keyof z.infer<T>] = "";
      }
    }
  }
  return parsedData;
}

//스키마 정의 설정
const emailSchema = z.string().email("올바른 이메일을 입력해 주세요.");

const nicknameSchema = z
  .string()
  .min(2, { message: "2글자 이상 입력해 주세요." });

const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다."
  );

const passwordCheckSchema = z
  .string()
  .min(1, { message: "비밀번호를 한번 더 입력해주세요." });

//스키마 object
const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordCheck: passwordCheckSchema,
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ["passwordCheck"],
    message: "비밀번호가 일치하지 않습니다.",
  });

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const myPageSchema = z.object({
  nickname: nicknameSchema,
});

//타입 지정
export type SignUpType = z.infer<typeof signUpSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type MyPageType = z.infer<typeof myPageSchema>;

//스키마 내보내기
export const userSchemas = {
  signUpSchema,
  loginSchema,
  myPageSchema,
};

//default 설정
export const userDefaultValues = {
  signUpDefaultValues: extractDefaultValues(signUpSchema),
  loginDefaultValues: extractDefaultValues(loginSchema),
  myPageDefaultValues: extractDefaultValues(myPageSchema),
};
