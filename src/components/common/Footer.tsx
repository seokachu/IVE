import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";
import { FaGithub } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#a0a0a0]">
      <div className="max-w-[1320px] m-auto py-9 px-[20px] flex justify-between items-center flex-col gap-5 lg:flex-row">
        <div className="flex gap-5 items-center flex-col lg:flex-row">
          <h1>
            <Image src={LogoImage} alt="logo" width={80} height={50} />
          </h1>
          <address className="not-italic text-sm">
            <ul className="flex text-center gap-[3px] flex-col lg:flex-row lg:gap-3">
              <li className="relative lg:after:absolute lg:after:top-[4px] lg:after:right-[-5.5px] lg:after:block lg:after:w-[1px] lg:after:h-[14px] lg:after:bg-[#333]">
                회사명 : &#40;주&#41;스타쉽엔터테인먼트
              </li>
              <li className="relative lg:after:absolute lg:after:top-[4px] lg:after:right-[-6px] lg:after:block lg:after:w-[1px] lg:after:h-[14px] lg:after:bg-[#333]">
                대표: 이훈희,이진성
              </li>
              <li className="relative lg:after:absolute lg:after:top-[4px] lg:after:right-[-7px] lg:after:block lg:after:w-[1px] lg:after:h-[14px] lg:after:bg-[#333]">
                사업자등록번호 : 114-86-65214
              </li>
              <li>주소 : 서울시 강남구 삼성로146길 4-5</li>
            </ul>
          </address>
        </div>
        <div>
          <ul className="flex gap-4">
            <li>
              <Link href="https://github.com/seokachu/IVE" target="_blank">
                <FaGithub size={25} />
              </Link>
            </li>
            <li>
              <Link href="https://seokachu.tistory.com" target="_blank">
                <FaBlog size={25} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
