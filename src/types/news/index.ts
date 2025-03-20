import { Dispatch, SetStateAction } from 'react';
import type { Database, Tables } from '../supabase';

export type NewsItem = Database['public']['Tables']['news_gallery']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];

export interface NewsGalleryProps {
  selectedCategory: string;
  newsItems: Tables<'news_gallery'>[];
  onClick: (newsItem: NewsItem) => void;
}

export interface NewsGalleryItemProps {
  item: Tables<'news_gallery'>;
  index: number;
  totalItems: number;
  onClick: () => void;
}

export interface LatestNewsDetailProps {
  item: Tables<'news_gallery'>;
}

export interface GalleryPhotoDetailProps {
  item: Tables<'gallery'>;
}

export interface GalleryPhotoListProps {
  gallery: Tables<'gallery'>[];
  onClick: (galleryItem: GalleryItem) => void;
}

export interface GalleryPhotoListItemProps {
  item: Tables<'gallery'>;
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
  contentType: 'news' | 'gallery';
}
