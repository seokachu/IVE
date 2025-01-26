import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";
import SignInModal from "@/components/auth/modal/SignInModal";
import SignUpForm from "@/components/auth/signup/SignUpForm";
import { signUpMetadata } from "@/metadata/signup/signupMetadata";

export const metadata = signUpMetadata;

const SignUp = () => {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <section className="max-w-[500px] px-5">
        <div className="flex justify-center items-center flex-col gap-3 mb-12">
          <h2 className="relative w-[100px] h-auto">
            <Image src={LogoImage} alt="logo image" className="fill" />
          </h2>
          <h3 className="text-xl font-bold">회원가입</h3>
        </div>
        <SignUpForm />
        <div className="text-dark-gray text-sm flex items-center gap-2 justify-center mt-5 ">
          <p>이미 회원이신가요?</p>
          <div className="text-font-color">
            <SignInModal
              title="로그인하기"
              className="underline underline-offset-1"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
