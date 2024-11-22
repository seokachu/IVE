import Image from "next/image";
import TestImage from "@/assets/images/default_image.avif";

const DescriptionTab = () => {
  return (
    <div className="text-center">
      <h3 className="font-bold text-2xl mb-10">검은색 로고 티셔츠</h3>
      <div className="flex flex-col gap-1">
        <p>심플하면서도 스타일리시한 디자인의 검은색 티셔츠 입니다.</p>
        <p>고급 면 소재로 제작되어 편안한 착용감을 제공하며,</p>
        <p>앞면에 깔끔한 로고가 프린트 되어 있습니다.</p>
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Image src={TestImage} alt="text" className="fill m-auto" />
      </div>
    </div>
  );
};

export default DescriptionTab;
