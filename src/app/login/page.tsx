import SignIn from "@/components/auth/login/SignIn";
import { loginMetadata } from "@/metadata/login/loginMetadata";

export const metadata = loginMetadata;

const page = () => {
  return (
    <main className="w-full h-[100dvh] lg:h-screen flex items-center justify-center -mt-[70px] lg:mt-0">
      <SignIn />
    </main>
  );
};

export default page;
