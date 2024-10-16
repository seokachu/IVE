import Navigation from "@/components/Navigation";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_black.svg";
import Link from "next/link";
import UserMenu from "../UserMenu";
import HeaderAside from "../HeaderAside";

const Header = () => {
  return (
    <header className="bg-gray-500">
      <div className="flex p-[20px] justify-between items-center max-w-[1320px] m-auto relative">
        <HeaderAside />
        <h1 className="cursor-pointer absolute top-[20px] left-2/4 -translate-x-2/4 lg:static lg:translate-x-0">
          <Link href="/">
            <Image src={LogoImage} alt="logo" width={80} height={50} />
          </Link>
        </h1>
        <Navigation />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
