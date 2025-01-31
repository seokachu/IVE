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
        <CarouselContent className="px-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-[65%] sm:basis-[65%] md:basis-[40%] lg:basis-[28%] mr-5"
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
      <CarouselContent className="px-5">
        {shopItems?.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-[65%] sm:basis-[65%] md:basis-[40%] lg:basis-[28%]"
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
