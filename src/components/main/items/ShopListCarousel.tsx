"use client";
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
  const { data: shopItems } = useShopCarousel();

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
            className="md:basis-1/2 lg:basis-1/3 pl-4"
          >
            <ShopListItem item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ShopListCarousel;
