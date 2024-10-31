"use client";
import { IoChatbubble } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import SignInEmail from "./SignInEmail";
import { IoIosArrowBack } from "react-icons/io";
import { DialogClose } from "@/components/ui/dialog";

const SignInContent = () => {
  const [showEmailSignIn, setShowEmailSignIn] = useState(false);

  const toggleEmailSignIn = () => {
    setShowEmailSignIn((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center w-full gap-5">
      {!showEmailSignIn ? (
        <div>
          <button className="w-full bg-[#fee500] px-20 py-3 rounded-full flex items-center justify-center relative text-sm font-bold mb-3">
            <IoChatbubble
              className="absolute left-5 top-2/4 -translate-y-2/4"
              size={20}
            />
            카카오로 3초 만에 시작하기
          </button>
          <button
            onClick={toggleEmailSignIn}
            className="w-full border border-1 border-dark-gray px-20 py-3 rounded-full flex items-center justify-center relative text-sm font-bold"
          >
            <MdOutlineEmail
              className="absolute left-5 top-2/4 -translate-y-2/4"
              size={20}
            />
            이메일로 로그인
          </button>
          <div className="my-5">
            <p className="relative w-full text-dark-gray text-center text-xs before:absolute before:w-32 before:h-[1px] before:left-0 before:bg-silver-gray before:top-2/4 before:-translate-y-2/4 after:absolute after:w-32 after:h-[1px] after:right-0 after:bg-silver-gray after:top-2/4 after:-translate-y-2/4">
              또는
            </p>
            <ul className="flex gap-5 items-center justify-center mt-3">
              <li>
                <button className="rounded-full p-1 w-10 h-10 bg-black">
                  <FaApple size={28} color="white" className="m-auto" />
                </button>
              </li>
              <li>
                <button className="rounded-full border p-1 w-10 h-10">
                  <FcGoogle size={30} className="m-auto" />
                </button>
              </li>
              <li>
                <button className="w-10 h-10">
                  <FaGithub size={38} className="translate-y-[2px]" />
                </button>
              </li>
            </ul>
          </div>
          <div className="flex gap-3 text-sm items-center justify-center">
            <p className="text-dark-gray text-xs">
              아직 계정이 없으신가요?
              <DialogClose asChild>
                <Link href="/signup" className="text-font-color ml-1">
                  회원가입하기
                </Link>
              </DialogClose>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={toggleEmailSignIn} className="absolute top-5 left-5">
            <IoIosArrowBack
              size={25}
              className="text-[#5e5e5e] hover:text-font-color"
            />
          </button>
          <SignInEmail />
        </div>
      )}
    </div>
  );
};

export default SignInContent;
