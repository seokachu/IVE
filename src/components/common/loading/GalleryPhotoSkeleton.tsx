import { Skeleton } from "@/components/ui/skeleton";

const GalleryPhotoSkeleton = () => {
  return (
    <section className="max-w-[1280px] flex justify-center align-center flex-col px-5 pt-32 pb-40 m-auto">
      <div className="flex flex-col items-center mb-12">
        <Skeleton className="w-56 h-12" />
        <Skeleton className="w-80 h-5 mt-5 mb-12" />
      </div>
      <div className="flex flex-wrap gap-8 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full sm:w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1.2rem)]"
          >
            <Skeleton className="aspect-square w-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryPhotoSkeleton;
