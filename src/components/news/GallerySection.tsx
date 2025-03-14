"use client";
import ActionButton from "../common/button/ActionButton";
import { FaArrowDown } from "react-icons/fa6";
import GalleryPhotoList from "./GalleryPhotoList";
import { useGallery } from "@/hooks/queries/useGallery";
import Error from "../common/error/Error";
import { useState } from "react";
import ContentDetailModal from "./ContentDetailModal";
import GalleryPhotoSkeleton from "../common/loading/GalleryPhotoSkeleton";
import type { GalleryItem } from "@/types";
import { GALLERY_DEFAULT_LIMIT } from "@/utils/constants";

const GallerySection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [itemLimit, setItemLimit] = useState(GALLERY_DEFAULT_LIMIT);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(
    null
  );
  const { data: gallery, isLoading, isError } = useGallery(itemLimit);

  if (isLoading) return <GalleryPhotoSkeleton />;
  if (isError) return <Error />;
  if (!gallery || gallery.length === 0) return null;

  //gallery list click handler
  const handleGalleryClick = (galleryItem: GalleryItem) => {
    setSelectedGallery(galleryItem);
    setModalOpen(true);
  };

  //더 많은 사진 보기 handler
  const handleLoadMore = () => {
    setItemLimit((prev) => prev + GALLERY_DEFAULT_LIMIT);
  };

  return (
    <section
      className="max-w-[1280px] flex justify-center align-center flex-col px-5 pt-32 pb-40 m-auto"
      id="gallery_section"
    >
      <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">
        Gallery
      </h2>
      <h3 className="text-center text-gray-600">특별한 순간을 담은 갤러리</h3>
      <div className="mt-16">
        <GalleryPhotoList gallery={gallery} onClick={handleGalleryClick} />
        <div className="text-center sticky bottom-10">
          {gallery.length >= itemLimit && (
            <ActionButton
              onClick={handleLoadMore}
              variant="primary"
              className="inline-flex justify-center items-center gap-1 px-8 py-4 !rounded-full text-sm lg:text-base"
            >
              <span>더 많은 사진 보기</span>
              <FaArrowDown className="animate-arrow" />
            </ActionButton>
          )}
        </div>
      </div>
      {modalOpen && (
        <ContentDetailModal
          isOpen={modalOpen}
          onOpenChange={() => setModalOpen(false)}
          contentType="gallery"
          content={selectedGallery}
        />
      )}
    </section>
  );
};

export default GallerySection;
