import Navigator from "@/components/Navigator";
import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";
import Link from "next/link";
import UserMenu from "../UserMenu";
import HeaderAside from "../HeaderAside";

const Header = () => {
  return (
    <header className="fixed right-0 top-0 left-0 z-10">
      <div className="flex p-[20px] justify-between items-center max-w-[1320px] m-auto relative text-white">
        <HeaderAside />
        <h1 className="cursor-pointer absolute top-[20px] left-2/4 -translate-x-2/4 lg:static lg:translate-x-0">
          <Link href="/">
            <Image src={LogoImage} alt="logo" width={80} height={50} />
          </Link>
        </h1>
        <Navigator />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
