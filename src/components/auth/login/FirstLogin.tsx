import { useEffect, useState } from "react";
import JSConfetti from "js-confetti";
import { toast } from "@/hooks/use-toast";
import SignInEmail from "@/components/auth/modal/SignInEmail";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_pink.svg";

const FirstLogin = () => {
  const [jsConfetti, setJsConfetti] = useState<JSConfetti | null>(null);

  useEffect(() => {
    const hasFirstLoginEffect = localStorage.getItem("loginEffect");
    if (hasFirstLoginEffect === "true") {
      const jsConfettiInstance = new JSConfetti();
      setJsConfetti(jsConfettiInstance);

      toast({
        title: "회원가입이 완료되었습니다!",
      });
      localStorage.setItem("loginEffect", "false");
    }
  }, []);

  useEffect(() => {
    if (jsConfetti) {
      jsConfetti?.addConfetti({
        confettiColors: ["#ff9f87", "#FFFFFF", "#EB7FEC", "#E72424"],
        confettiRadius: 5,
        confettiNumber: 300,
      });
    }
  }, [jsConfetti]);

  return (
    <>
      <div className="flex items-center justify-center flex-col mb-10">
        <h2 className="relative w-[100px] h-auto my-5">
          <Image src={LogoImage} alt="logo image" className="fill" />
        </h2>
        <h3 className="text-xl font-bold mb-1">회원이 되신 것을 축하드립니다!</h3>
        <p>함께 응원하고, 소중한 순간들을 나눠보세요.</p>
      </div>
      <SignInEmail redirectPath="/" />
    </>
  );
};

export default FirstLogin;
