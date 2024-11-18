import TestImage from "@/assets/images/album_img.webp";
import Image from "next/image";

const UserInfo = () => {
  return (
    <section>
      <div>
        <div className="relative overflow-hidden rounded-full w-[80px] h-auto">
          <Image src={TestImage} alt="test" className="fill" />
        </div>
        <div className="flex justify-between mt-5">
          <h2 className="font-bold">닉네임님</h2>
          <button className="text-sm text-white py-1 px-3 bg-purple rounded-md">
            수정
          </button>
        </div>
      </div>
      <div className="flex border-y p-5 my-5">
        <div className="w-2/4">
          <p className="text-xs text-[#495057] mb-1">글 작성수</p>
          <strong>-</strong>
        </div>
        <div className="w-2/4">
          <p className="text-xs text-[#495057] mb-1">찜</p>
          <strong>2</strong>
        </div>
      </div>
      <ul className="flex lg:flex-col gap-5 border-b lg:border-b-0 pb-5 text-center lg:text-left">
        <li className="font-bold">찜목록</li>
        <li>내가 쓴 글</li>
        <li>결제 목록</li>
      </ul>
    </section>
  );
};

export default UserInfo;
