"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoImage from "@/assets/images/logo_black.svg";
import Link from "next/link";
import { gnbArray } from "@/lib/data";
import { gnbArrayList } from "@/types";
import { VscChevronRight } from "react-icons/vsc";
import { useState } from "react";

const HeaderAside = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickClose = () => {
    setIsOpen(true);
    console.log(isOpen);
  };

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <RxHamburgerMenu size={25} />
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>
              <h1 className="p-[20px]">
                <Image src={LogoImage} alt="logo" width={80} height={50} />
              </h1>
            </SheetTitle>
            <nav className="!mt-10">
              <ul className="flex flex-col justify-center">
                {gnbArray.map((el: gnbArrayList) => (
                  <li
                    key={el.label}
                    className="flex items-center justify-between py-4 px-4 border-b-[1px] border-dark-gray cursor-pointer hover:bg-slate-300"
                    onClick={onClickClose}
                  >
                    <Link href={el.path} className="block w-full">
                      {el.label}
                    </Link>
                    <VscChevronRight size={20} />
                  </li>
                ))}
              </ul>
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HeaderAside;
