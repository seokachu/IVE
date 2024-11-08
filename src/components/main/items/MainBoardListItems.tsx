import Image from "next/image";
import { BiCommentDots } from "react-icons/bi";
import TestImage from "@/assets/images/test.webp";

const MainBoardListItems = () => {
  return (
    <li className="flex gap-5 items-center justify-center mt-5 w-full lg:w-2/4 lg:justify-start">
      <div className="border overflow-hidden rounded-lg">
        <Image
          src={TestImage}
          alt="img"
          className="object-cover w-[70px] h-[70px] lg:w-[100px] lg:h-[100px]"
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col gap-2 w-2/3">
        <h3 className="font-bold text-base lg:text-xl overflow-hidden text-ellipsis whitespace-nowrap">
          아이브 월두투어
          사진alksdjf;alskdjf;alskdj;alksdfja;lsdkja;lsdkfj;akasdfasdfasdfasdfasdfasdfa
        </h3>
        <div className="flex gap-3 text-dark-gray text-sm">
          <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-2/4 after:-translate-y-2/4">
            서카츄
          </p>
          <div className="flex gap-1 items-center translate-y-[2px]">
            <BiCommentDots size={20} />
            <p className="-translate-y-[2px]">12</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MainBoardListItems;
