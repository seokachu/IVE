import SignIn from "@/components/auth/login/SignIn";
import { loginMetadata } from "@/metadata/login/loginMetadata";

export const metadata = loginMetadata;

const page = () => {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <SignIn />
    </main>
  );
};

export default page;
