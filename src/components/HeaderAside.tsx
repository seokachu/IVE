import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoImage from "@/assets/images/logo_black.svg";
import Link from "next/link";
import { gnbArray } from "@/lib/data";
import { gnbArrayList } from "@/types";

const HeaderAside = () => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <RxHamburgerMenu size={25} />
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <h1>
              <Image src={LogoImage} alt="logo" width={80} height={50} />
            </h1>
            <nav className="!mt-10">
              <ul className="flex flex-col justify-center gap-5">
                {gnbArray.map((el: gnbArrayList) => (
                  <li key={el.label} className="border-b-4-red-400 ">
                    <Link href={el.path}>{el.label}</Link>
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
