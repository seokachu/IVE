import Image from "next/image";
import LogoImage from "@/assets/images/logo_black.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import SignInContent from "./SignInContent";

const SignIn = ({ title = "로그인/회원가입" }) => {
  return (
    <Dialog>
      <DialogTrigger>{title}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="relative w-[100px] h-auto mb-5">
            <Image src={LogoImage} alt="logo image" className="fill" />
            <DialogDescription className="hidden">회원가입</DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <SignInContent />
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;
