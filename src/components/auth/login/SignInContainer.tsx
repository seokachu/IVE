"use client";
import { useSearchParams } from "next/navigation";
import FirstLogin from "./FirstLogin";
import RegularLogin from "./RegularLogin";

const SignInContainer = () => {
  const searchParams = useSearchParams();
  const isFormSignup = searchParams.get("form") === "signup";

  return (
    <section className="max-w-[500px] px-5">
      {isFormSignup ? (
        <FirstLogin/>
      ) : (
        <RegularLogin />
      )}
    </section>
  );
};

export default SignInContainer;
