"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoImage from "@/assets/images/logo_black.svg";
import MobileNavigator from "./MobileNavigator";
import MobileUserMenu from "./MobileUserMenu";

const HeaderAside = () => {
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
            <MobileUserMenu />
            <MobileNavigator />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HeaderAside;
