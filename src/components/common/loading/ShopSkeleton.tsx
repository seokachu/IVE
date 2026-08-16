import { Skeleton } from "@/components/ui/skeleton";
import type { VariantTypeProps } from "@/types/shop";

//시안 기준: 카드와 동일 실루엣 — 이미지 블록 + 이름·가격 바
const ShopSkeleton = ({ variant = "shop" }: VariantTypeProps) => {
  //carousel에서는 SwiperSlide(li)가 감싸므로 li 중첩을 피하기 위해 div로 렌더링
  const Tag = variant === "carousel" ? "div" : "li";

  return (
    <Tag className="w-full">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <div className="flex flex-col gap-2 mt-2.5">
        <Skeleton className="h-3.5 w-40 rounded" />
        <Skeleton className="h-3.5 w-24 rounded" />
      </div>
    </Tag>
  );
};

export default ShopSkeleton;
