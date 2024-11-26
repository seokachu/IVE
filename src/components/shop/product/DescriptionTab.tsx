import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { useShop } from "@/hooks/queries/useShops";
import type { ShopMenuProps } from "@/types";
import Error from "@/components/common/error/Error";
import ProductDescriptionSkeleton from "@/components/common/loading/ProductDescriptionSkeleton";

const DescriptionTab = ({ id }: ShopMenuProps) => {
  const { data, isLoading, isError } = useShop(id);

  if (isLoading) return <ProductDescriptionSkeleton />;
  if (isError) return <Error />;

  return (
    <div className="text-center">
      <h3 className="font-bold text-2xl mb-10">{data.title}</h3>
      <div className="flex flex-col gap-1">
        <p>{data.description?.[0]}</p>
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Image
          src={data.images?.[0] || DefaultImage}
          alt={data.title}
          className="fill m-auto"
          width={500}
          height={500}
        />
      </div>
      <div>
        <p>{data.description?.[1]}</p>
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Image
          src={data.images?.[1] || DefaultImage}
          alt={data.title}
          className="fill m-auto"
          width={500}
          height={500}
        />
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Image
          src={data.images?.[2] || DefaultImage}
          alt={data.title}
          className="fill m-auto"
          width={500}
          height={500}
        />
      </div>
      <div>
        <p>{data.description?.[2]}</p>
      </div>
    </div>
  );
};

export default DescriptionTab;
