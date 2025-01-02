"use client";
import ShopSkeleton from "@/components/common/loading/ShopSkeleton";
import ShopListItem from "@/components/shop/ShopListItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useShopCarousel } from "@/hooks/queries/useShops";

const ShopListCarousel = () => {
  const { data: shopItems, isLoading } = useShopCarousel();

  if (isLoading) {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-[1280px]"
      >
        <CarouselContent className="-ml-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="sm:1/2 md:basis-1/3 lg:basis-1/4 lg:mr-10"
            >
              <ShopSkeleton variant="carousel" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-[1280px]"
    >
      <CarouselContent className="-ml-4">
        {shopItems?.map((item) => (
          <CarouselItem
            key={item.id}
            className="sm:1/2 md:basis-1/3 lg:basis-1/4 lg:mr-10"
          >
            <ShopListItem item={item} variant="carousel" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ShopListCarousel;
