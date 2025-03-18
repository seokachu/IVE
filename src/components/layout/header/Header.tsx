"use client";
import Navigator from "@/components/layout/header/components/Navigator";
import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";
import SubLogoImage from "@/assets/images/logo_black.svg";
import Link from "next/link";
import UserMenu from "./components/UserMenu";
import HeaderAside from "./components/HeaderAside";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/utils/utils";
import { scrollState } from "@/store";
import { useRecoilState } from "recoil";
import { throttle } from "lodash";

const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const [isScrolled, setIsScrolled] = useRecoilState(scrollState);

  useEffect(() => {
    setIsScrolled(!isMainPage);
  }, [pathname, isMainPage, setIsScrolled]);

  useEffect(() => {
    if (!isMainPage) return;

    const handleScroll = throttle(() => {
      const secondSection = document.getElementById("second-section");
      if (secondSection) {
        const sectionTop = secondSection.getBoundingClientRect().top;
        if (sectionTop <= 30) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [isMainPage, setIsScrolled]);

  // 조건문 header logo
  const logoSrc = isMainPage
    ? isScrolled
      ? SubLogoImage
      : LogoImage
    : SubLogoImage;

  return (
    <header
      className={cn(
        isMainPage ? "fixed" : "relative",
        "right-0 top-0 left-0 z-20 w-screen overflow-x-hidden h-[75px] flex items-center",
        isScrolled && "bg-white text-black shadow-sm"
      )}
    >
      <div
        className={cn(
          "flex w-full p-[20px] justify-between items-center max-w-[1320px] m-auto relative text-white",
          isScrolled && "text-font-color"
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
