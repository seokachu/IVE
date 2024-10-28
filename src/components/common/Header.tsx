"use client";
import Navigator from "@/components/Navigator";
import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";
import SubLogoImage from "@/assets/images/logo_black.svg";
import Link from "next/link";
import UserMenu from "../UserMenu";
import HeaderAside from "../HeaderAside";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isMainPage);

  useEffect(() => {
    setIsScrolled(!isMainPage);
  }, [pathname, isMainPage]);

  useEffect(() => {
    if (!isMainPage) return;

    const handleScroll = () => {
      const secondSection = document.getElementById("second-section");
      if (secondSection) {
        const sectionTop = secondSection.getBoundingClientRect().top;
        if (sectionTop <= 30) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMainPage]);

  //조건문 header logo
  let logoSrc;

  if (isMainPage) {
    if (isScrolled) {
      logoSrc = SubLogoImage;
    } else {
      logoSrc = LogoImage;
    }
  } else {
    logoSrc = SubLogoImage;
  }

  return (
    <header
      className={cn(
        "fixed right-0 top-0 left-0 z-10",
        isScrolled && "bg-white text-black shadow-sm"
      )}
    >
      <div
        className={cn(
          "flex p-[20px] justify-between items-center max-w-[1320px] m-auto relative text-white",
          isScrolled && "text-[#0A0A0A]"
        )}
      >
        <HeaderAside />
        <h1 className="cursor-pointer absolute top-[20px] left-2/4 -translate-x-2/4 lg:static lg:translate-x-0">
          <Link href="/" className="relative w-[80px] h-auto block">
            <Image src={logoSrc} alt="logo" className="fill" priority />
          </Link>
        </h1>
        <Navigator />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
