import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import type { BoardDetailProps } from "@/types";

const BoardDetailUserInfo = ({ item }: BoardDetailProps) => {
  return (
    <div className="flex bg-gray-100 rounded-md py-3 px-2 lg:px-5">
      <div className="flex gap-2 items-center">
        <h3 className="relative w-[30px] lg:w-[40px] h-auto overflow-hidden border rounded-full">
          <Image
            src={item?.user?.avatar_url || DefaultImage}
            alt={item?.user?.name || "유저닉네임"}
            className="fill"
            width={500}
            height={500}
          />
        </h3>
        <h2 className="text-xs lg:text-sm">{item?.user?.name}</h2>
      </div>
    </div>
  );
};

export default BoardDetailUserInfo;
