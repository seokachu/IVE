import Image from "next/image";
import Link from "next/link";
import { LuMusic4 } from "react-icons/lu";
import { musicIcon } from "@/lib/data";
import TestImage from "@/assets/images/test.webp";

const AlbumListItems = () => {
  return (
    <li className="flex flex-col items-center p-5 lg:flex-row lg:gap-12  lg:p-0">
      <Image src={TestImage} alt="앨범" />
      <div className="w-full">
        <h3 className="text-xl lg:text-2xl font-bold text-center mt-5 mb-2">
          SWITCH
        </h3>
        <ul>
          <li className="flex justify-center gap-3 text-sm lg:text-base text-silver-gray opacity-90">
            <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
              2024.10.15
            </p>
            <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
              j팝
            </p>
            <p>1곡</p>
          </li>
        </ul>
        <h3 className="flex items-center justify-center gap-1 font-bold my-5 border-b-[1px] pb-3">
          <LuMusic4 size={20} className="translate-y-[1px]" />
          음원듣기
        </h3>
        <ul className="flex items-center justify-center gap-3">
          {musicIcon.map((el, index) => (
            <li key={index}>
              <Link href="" target="_blank" className="size-10 block">
                <Image
                  src={el.icon}
                  alt={el.label}
                  className="rounded-[40px] object-cover size-10"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default AlbumListItems;
