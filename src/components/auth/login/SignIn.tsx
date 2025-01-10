import { Suspense } from "react";
import SignInContainer from "./SignInContainer";
import SignInLoading from "@/components/common/loading/SignInLoading";

const SignIn = () => {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContainer />
    </Suspense>
  );
};

export default SignIn;
