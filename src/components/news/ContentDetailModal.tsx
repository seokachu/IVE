import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import GalleryPhotoDetail from "./GalleryPhotoDetail";
import LatestNewsDetail from "./LatestNewsDetail";
import { X } from "lucide-react";
import type { GalleryItem, NewsItem } from "@/types";

interface ContentDetailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  content: NewsItem | GalleryItem | null;
  contentType: "news" | "gallery";
}

const ContentDetailModal = ({
  isOpen,
  onOpenChange,
  content,
  contentType = "news",
}: ContentDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`p-0 max-w-[95%] lg:max-w-[50%] overflow-hidden ${
          contentType === "news"
            ? "min-h-[90dvh] lg:min-h-[80dvh] max-h-[90dvh] lg:max-h-[80dvh]"
            : "h-auto"
        }`}
      >
        <DialogClose className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md z-50 hover:bg-gray-100 flex items-center justify-center w-8 h-8">
          <X className="h-5 w-5" />
          <span className="sr-only">닫기</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="sr-only">
            {contentType === "news" ? "최신 소식 뉴스" : "사진 갤러리"}
          </DialogTitle>
          <DialogDescription
            className={`!m-0 ${
              contentType === "news" ? "max-h-[80dvh] overflow-y-auto" : ""
            }`}
          >
            {contentType === "news" ? (
              <LatestNewsDetail item={content as NewsItem} />
            ) : (
              <GalleryPhotoDetail item={content as GalleryItem} />
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailModal;
