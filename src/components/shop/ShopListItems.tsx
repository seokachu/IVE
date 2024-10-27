import Image from "next/image";
import TestImage from "@/assets/images/test.webp";
import Badge from "@/components/elements/Badge";
import { FaStar } from "react-icons/fa";

const ShopListItems = () => {
  return (
    <>
      <li>
        <Image src={TestImage} alt="앨범" />
        <div className="flex flex-col gap-1">
          <Badge />
          <h3 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap">
            SWITCH 앨범제목!
          </h3>
          <div className="font-bold flex items-center gap-2 text-xl">
            <span className="text-purple">10%</span>
            <span className="">45,000 원</span>
          </div>
          <div className="flex items-center gap-1 text-[#878f91] text-sm">
            <FaStar />
            <span>4.8</span>
          </div>
        </div>
      </li>
    </>
  );
};

export default ShopListItems;
