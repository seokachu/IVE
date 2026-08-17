"use client";
import Navigator from "@/components/layout/header/components/Navigator";
import Image from "next/image";
import PinkLogoImage from "@/assets/images/logo_pink.svg";
import Link from "next/link";
import UserMenu from "./components/UserMenu";
import HeaderAside from "./components/HeaderAside";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/utils/utils";
import ThemeToggle from "./components/ThemeToggle";
import { useIsScrolled, useUiActions } from "@/store/zustand";
import { throttle } from "lodash";

const Header = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const isScrolled = useIsScrolled();
  const { setScrolled } = useUiActions();

  useEffect(() => {
    setScrolled(!isMainPage);
  }, [pathname, isMainPage, setScrolled]);

  useEffect(() => {
    if (!isMainPage) return;

    const handleScroll = throttle(() => {
      const secondSection = document.getElementById("second-section");
      if (secondSection) {
        const sectionTop = secondSection.getBoundingClientRect().top;
        if (sectionTop <= 30) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [isMainPage, setScrolled]);


  return (
    <header
      className={cn(
        isMainPage ? "fixed" : "relative",
        "right-0 top-0 left-0 z-20 w-screen overflow-x-hidden h-[75px] flex items-center",
        isScrolled && "bg-background text-foreground shadow-sm",
      )}
    >
      <div
        className={cn(
          "flex w-full p-[20px] justify-between items-center max-w-container m-auto relative text-white",
          isScrolled && "text-gray-900",
        )}
      >
        <HeaderAside />
        <h1 className="cursor-pointer absolute top-[20px] left-2/4 -translate-x-2/4 lg:static lg:translate-x-0">
          <Link href="/" className="relative w-[30px] h-auto block">
            <Image src={PinkLogoImage} alt="logo" className="fill" priority />
          </Link>
        </h1>
        <Navigator />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
