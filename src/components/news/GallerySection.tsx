"use client";
import ActionButton from "../common/button/ActionButton";
import { FaArrowDown } from "react-icons/fa6";
import GalleryPhotoList from "./GalleryPhotoList";
import { useGallery } from "@/hooks/queries/useGallery";
import Error from "../common/error/Error";

const GallerySection = () => {
  const { data: gallery, isLoading, isError } = useGallery();

  if (isLoading) return null;
  if (isError) return <Error />;
  if (!gallery || gallery.length === 0) return null;

  console.log(gallery);
  return (
    <section
      className="max-w-[1280px] flex justify-center align-center flex-col px-5 pt-32 pb-40 m-auto"
      id="gallery_section"
    >
      <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">
        Gallery
      </h2>
      <h3 className="text-center text-gray-600">특별한 순간을 담은 갤러리</h3>
      <GalleryPhotoList gallery={gallery} />
      <div className="text-center">
        <ActionButton
          variant="primary"
          className="inline-flex justify-center items-center gap-1 px-8 py-4 !rounded-full"
        >
          <span>더 많은 사진 보기</span>
          <FaArrowDown className="animate-arrow" />
        </ActionButton>
      </div>
    </section>
  );
};

export default GallerySection;
