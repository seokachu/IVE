import { Skeleton } from "@/components/ui/skeleton";
import type { VariantTypeProps } from "@/types/shop";

const SHOP_STYLES = {
  shop: "w-2/6 md:w-[calc(33.333%-0.9rem)] lg:w-[calc(25%-0.95rem)]",
  carousel: "w-full sm:border sm:p-4 sm:rounded-lg",
} as const;

const ShopSkeleton = ({ variant = "shop" }: VariantTypeProps) => {
  return (
    <li className={`${SHOP_STYLES[variant]} md:border p-0 md:p-4 md:rounded-lg group mb-7 md:mb-5`}>
      <div className="relative w-full aspect-square md:rounded-lg border">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-8 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </div>
    </li>
  );
};

export default ShopSkeleton;
