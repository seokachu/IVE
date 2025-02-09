import Image from "next/image";
import TestImage from "@/assets/images/default_image.avif";

const BoardDetailUserInfo = () => {
  return (
    <div className="flex bg-gray-100 rounded-md py-3 px-2 lg:px-5">
      <div className="flex gap-2 items-center">
        <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full">
          <Image src={TestImage} alt="test" className="fill" />
        </h3>
        <h2>익명의아이브</h2>
      </div>
    </div>
  );
};

export default BoardDetailUserInfo;
