import { Dispatch, SetStateAction } from "react";
import type { Tables } from "../supabase";
import type { GalleryItem, NewsItem } from "@/types/index";

export interface NewsGalleryProps {
  selectedCategory: string;
  newsItems: Tables<"news_gallery">[];
  onClick: (newsItem: NewsItem) => void;
}

export interface NewsGalleryItemProps {
  item: Tables<"news_gallery">;
  index: number;
  totalItems: number;
  onClick: () => void;
}

export interface LatestNewsDetailProps {
  item: Tables<"news_gallery">;
}

export interface GalleryPhotoDetailProps {
  item: Tables<"gallery">;
}

export interface GalleryPhotoListProps {
  gallery: Tables<"gallery">[];
  onClick: (galleryItem: GalleryItem) => void;
}

export interface GalleryPhotoListItemProps {
  item: Tables<"gallery">;
  onClick: () => void;
}

export interface NewsCategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

export interface ContentDetailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  content: NewsItem | GalleryItem | null;
  contentType: "news" | "gallery";
}
