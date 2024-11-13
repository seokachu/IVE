"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoImage from "@/assets/images/logo_black.svg";
import MobileNavigator from "./MobileNavigator";
import MobileUserMenu from "./MobileUserMenu";
import UserAvatar from "@/components/common/UserAvatar";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import SignOutButton from "@/components/common/button/SignOutButton";
import { useRef } from "react";

const HeaderAside = () => {
  const session = useRecoilValue(sessionState);
  const closeRef = useRef<HTMLButtonElement>(null);

  const onSignOutSuccess = () => {
    closeRef.current?.click();
  };

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <RxHamburgerMenu size={25} />
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="p-[20px] relative w-[120px] h-auto">
              <Image src={LogoImage} alt="logo" className="fill" />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation Menu
            </SheetDescription>
            {session && (
              <div className="px-5 py-5">
                <div className="flex items-center gap-2">
                  <UserAvatar size="md" />
                  <h2 className="font-bold">
                    {session?.user.user_metadata.name}
                  </h2>
                  <SignOutButton
                    className="text-sm text-dark-gray ml-auto"
                    onSuccess={onSignOutSuccess}
                  />
                </div>
              </div>
            )}
            <MobileUserMenu />
            <MobileNavigator />
          </SheetHeader>
          <SheetClose ref={closeRef} className="hidden" />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HeaderAside;
