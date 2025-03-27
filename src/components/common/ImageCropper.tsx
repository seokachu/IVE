import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (blob: Blob) => void;
  defaultImage: string;
}

const ImageCropper = ({ imageSrc, isOpen, onClose, onSave, defaultImage }: ImageCropperProps) => {
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor | null>(null);

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = (editorRef.current as AvatarEditor).getImageScaledToCanvas();
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          onSave(blob);
          onClose();
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md py-10">
        <DialogHeader>
          <DialogTitle className="mb-2">프로필 이미지 편집</DialogTitle>
          <DialogDescription>이미지를 원하는 크기로 조정하세요.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <AvatarEditor
            ref={editorRef}
            image={imageSrc || defaultImage}
            width={250}
            height={250}
            border={50}
            borderRadius={125}
            color={[0, 0, 0, 0.6]}
            scale={scale}
            rotate={0}
          />
          <div className="w-full flex items-center gap-2">
            <span className="text-sm flex-1">확대&#47;축소:</span>
            <input
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full flex-[5]"
            />
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="w-full">
              취소
            </Button>
            <Button onClick={handleSave} className="w-full">
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
