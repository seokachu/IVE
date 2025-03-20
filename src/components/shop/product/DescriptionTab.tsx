import Image from 'next/image';
import DefaultImage from '@/assets/images/default_image.avif';
import { useShop } from '@/hooks/queries/useShops';
import Error from '@/components/common/error/Error';
import ProductDescriptionSkeleton from '@/components/common/loading/ProductDescriptionSkeleton';
import type { ShopMenuProps } from '@/types/shop';

const DescriptionTab = ({ id }: ShopMenuProps) => {
  const { data, isLoading, isError } = useShop(id);

  if (isLoading) return <ProductDescriptionSkeleton />;
  if (isError) return <Error />;

  return (
    <div className="text-center">
      <h3 className="font-bold text-lg mb-10">{data.title}</h3>
      <div className="flex flex-col gap-1">
        <p>{data.description?.[0]}</p>
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Image
          src={data.images?.[0] || DefaultImage}
          alt={data.title}
          className="fill m-auto"
          width={650}
          height={650}
        />
      </div>
      {data.description?.[1] && (
        <div>
          <p>{data.description?.[1]}</p>
        </div>
      )}
      {data.images?.[1] && (
        <div className="w-full h-auto m-auto relative my-16">
          <Image src={data.images[1]} alt={data.title} className="fill m-auto" width={650} height={650} />
        </div>
      )}
      {data.images?.[2] && (
        <div className="w-full h-auto m-auto relative my-16">
          <Image src={data.images[2]} alt={data.title} className="fill m-auto" width={650} height={650} />
        </div>
      )}
      {data.description?.[2] && (
        <div>
          <p>{data.description[2]}</p>
        </div>
      )}
    </div>
  );
};

export default DescriptionTab;
