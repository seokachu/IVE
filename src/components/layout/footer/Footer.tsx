import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";
import SubLogoImage from "@/assets/images/logo_black.svg";
import { UserRound } from "lucide-react";
import GithubIcon from "@/components/common/icons/GithubIcon";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 relative z-10">
      <div className="max-w-container m-auto py-10 px-5 flex flex-col items-center gap-5">
        <h1 className="relative w-[80px] h-auto">
          <Image src={SubLogoImage} alt="logo" className="fill dark:hidden" />
          <Image src={LogoImage} alt="logo" className="fill hidden dark:block" />
        </h1>
        <div className="flex flex-col items-center gap-1.5 text-center text-xs text-gray-500">
          <p>IVE로 DIVE는 팬이 만든 비공식 팬 사이트이며, 포트폴리오 목적으로 제작되었습니다.</p>
          <p>아이브(IVE) 관련 콘텐츠의 저작권은 스타쉽엔터테인먼트에 있습니다.</p>
          <p className="font-semibold text-gray-600 mt-1">© 2026 seokachu. All rights reserved.</p>
        </div>
        <ul className="flex gap-3">
          <li>
            <Link
              href="https://github.com/seokachu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="깃허브 새창으로 열기"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <GithubIcon size={18} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.seokachu.site/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="포트폴리오 사이트 새창으로 열기"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <UserRound size={18} />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
