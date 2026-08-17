"use client";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ImageCropperProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (blob: Blob) => void | Promise<void>;
  defaultImage?: string;
}

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    //소셜 CDN 이미지를 크롭할 때 캔버스가 오염되지 않도록 CORS 모드로 로드
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    image.src = url;
  });

//크롭 영역(원본 픽셀 기준)을 캔버스로 잘라 Blob 생성 — 아바타 용도라 최대 512px로 다운스케일
const getCroppedBlob = async (src: string, area: Area): Promise<Blob> => {
  const image = await createImage(src);
  const size = Math.min(Math.round(area.width), 512);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 사용할 수 없습니다.");
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, size, size);
  //webp 미지원 브라우저는 png Blob으로 폴백되고, 업로드 확장자는 blob.type을 따라간다
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("이미지 변환에 실패했습니다."))), "image/webp", 0.9),
  );
};

//프로필 이미지 크롭 모달 — 드래그 이동 + 휠·핀치·슬라이더 줌, 원형 마스크 (react-easy-crop)
const ImageCropper = ({ imageSrc, isOpen, onClose, onSave, defaultImage }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const src = imageSrc || defaultImage;

  //새 이미지를 열 때마다 위치·배율 초기화
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setAreaPixels(null);
    }
  }, [isOpen, imageSrc]);

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setAreaPixels(croppedAreaPixels);
  }, []);

  //성공 시 닫기는 부모가 처리하고, 실패 시 모달을 열어 둔 채 재시도할 수 있게 한다
  const handleSave = async () => {
    if (!src || !areaPixels || isSaving) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedBlob(src, areaPixels);
      await onSave(blob);
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: "이미지 편집에 실패했습니다.", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">프로필 이미지 편집</DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            드래그로 위치를, 휠·핀치나 슬라이더로 배율을 조정하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {/* 크롭 영역 — 원형 마스크 밖은 딤 처리 */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-900">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              minZoom={1}
              maxZoom={3}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              mediaProps={{ crossOrigin: "anonymous" }}
            />
          </div>
          {/* 배율 슬라이더 */}
          <div className="flex items-center gap-3 px-1">
            <ZoomOut size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label="이미지 확대/축소"
              className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-purple-400"
            />
            <ZoomIn size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
          </div>
          {/* 액션 — 프로필 수정 모달과 동일한 버튼 스타일 */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[46px] rounded-full border border-gray-300 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !src}
              className="flex-1 h-[46px] rounded-full bg-purple-300 text-sm font-bold text-white hover:bg-purple-400 transition-colors disabled:opacity-50"
            >
              {isSaving ? "저장 중…" : "저장하기"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
