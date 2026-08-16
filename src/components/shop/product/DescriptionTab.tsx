import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { useShopDetail } from "@/hooks/queries/useShops";
import Error from "@/components/common/error/Error";
import ProductDescriptionSkeleton from "@/components/common/loading/ProductDescriptionSkeleton";
import type { ShopMenuProps } from "@/types/shop";

const DescriptionTab = ({ id }: ShopMenuProps) => {
  const { data, isLoading, isError } = useShopDetail(id);

  if (isLoading) return <ProductDescriptionSkeleton />;
  if (isError) return <Error />;

  return (
    //시안 기준: 가운데 정렬 본문 + 라운드 상세 이미지
    <div className="m-auto max-w-[960px] text-center">
      <h3 className="text-xl font-bold lg:text-[1.375rem]">{data.title}</h3>
      <p className="mt-4 text-sm text-gray-500">{data.description?.[0]}</p>
      <div className="relative m-auto my-10 w-full overflow-hidden rounded-2xl lg:my-12">
        <Image
          src={data.images?.[0] || DefaultImage}
          alt={data.title}
          className="m-auto w-full"
          width={960}
          height={960}
        />
      </div>
      {data.description?.[1] && <p className="text-sm text-gray-500">{data.description?.[1]}</p>}
      {data.images?.[1] && (
        <div className="relative m-auto my-10 w-full overflow-hidden rounded-2xl lg:my-12">
          <Image src={data.images[1]} alt={data.title} className="m-auto w-full" width={960} height={960} />
        </div>
      )}
      {data.images?.[2] && (
        <div className="relative m-auto my-10 w-full overflow-hidden rounded-2xl lg:my-12">
          <Image src={data.images[2]} alt={data.title} className="m-auto w-full" width={960} height={960} />
        </div>
      )}
      {data.description?.[2] && <p className="text-sm text-gray-500">{data.description[2]}</p>}
    </div>
  );
};

export default DescriptionTab;
