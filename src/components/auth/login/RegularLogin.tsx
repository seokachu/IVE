import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";
import OAuthLogin from "./OAuthLogin";
import SignInEmail from "@/components/auth/modal/SignInEmail";

const RegularLogin = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col mb-10">
        <h2 className="relative w-[100px] h-auto my-5">
          <Image src={LogoImage} alt="logo image" className="fill" />
        </h2>
        <h3 className="text-xl font-bold mb-1">로그인</h3>
      </div>
      <SignInEmail redirectPath="/" />
      <div className="my-5 w-full">
        <p className="relative text-dark-gray text-center text-xs before:absolute before:w-20 before:md:w-32 before:h-[1px] before:left-0 before:bg-silver-gray before:top-2/4 before:-translate-y-2/4 after:absolute after:w-20 after:md:w-32 after:h-[1px] after:right-0 after:bg-silver-gray after:top-2/4 after:-translate-y-2/4">
          또는
        </p>
        <OAuthLogin />
      </div>
    </>
  );
};

export default RegularLogin;
