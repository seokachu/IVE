import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ShopListItem from "@/components/shop/ShopListItem";

const ShopListCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-[1280px]"
    >
      <CarouselContent className="-ml-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
            {/* <ShopListItem /> */}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ShopListCarousel;
