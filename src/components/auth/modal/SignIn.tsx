import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";

const SignIn = () => {
  return (
    <>
      <h1>
        <Image src={LogoImage} alt="logo image" />
      </h1>
      <button>로그인</button>
    </>
  );
};

export default SignIn;
