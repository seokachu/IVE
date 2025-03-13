import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GalleryPhotoDetail from "./GalleryPhotoDetail";
import LatestNewsDetail from "./LatestNewsDetail";
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
      <DialogContent className="p-0 max-w-[95%] lg:max-w-[50%] min-h-[90dvh] lg:min-h-[80dvh] max-h-[90dvh] lg:max-h-[80dvh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {contentType === "news" ? "최신 소식 뉴스" : "사진 갤러리"}
          </DialogTitle>
          <DialogDescription className="!m-0 max-h-[80dvh] overflow-y-auto">
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
