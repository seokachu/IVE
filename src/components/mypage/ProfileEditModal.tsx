"use client";
import { ChangeEvent, useRef, useState } from "react";
import { Camera, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserAvatar from "@/components/common/UserAvatar";
import ImageCropper from "@/components/common/ImageCropper";
import { NicknameType, userSchemas } from "@/hooks/user";
import { updateNickname } from "@/lib/supabase/auth";
import { uploadAvatar } from "@/lib/supabase/storage";
import { useUpdateUserSession } from "@/hooks/useUpdateUserSession";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/store/zustand";
import { getAvatarUrl, getDisplayName } from "@/utils/userProfile";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//프로필 수정 모달 — 아바타 변경(크롭) + 닉네임 수정, 이메일은 읽기 전용 (.pen "프로필 수정 모달" 시안)
const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const session = useSession();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const { updateUserAndRefresh } = useUpdateUserSession();

  const form = useForm<NicknameType>({
    mode: "onChange",
    resolver: zodResolver(userSchemas.myPageNicknameSchema),
    defaultValues: { nickname: getDisplayName(session?.user) },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const nickname = watch("nickname") || "";

  //아바타 클릭 → 파일 선택 → 크롭 모달
  const handleAvatarClick = () => {
    if (!isCropperOpen) inputRef.current?.click();
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSrc(URL.createObjectURL(file));
      setIsCropperOpen(true);
    }
    e.target.value = "";
  };

  const closeCropper = () => {
    setIsCropperOpen(false);
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  };

  //크롭 저장 → 즉시 업로드 (커스텀 키에 저장해야 소셜 재로그인 시 프로바이더 이미지로 원복되지 않음)
  //실패 시 크로퍼를 열어 둬 재시도할 수 있게 한다
  const handleSaveImage = async (blob: Blob) => {
    try {
      const avatarUrl = await uploadAvatar(blob);
      await updateUserAndRefresh({ data: { custom_avatar_url: avatarUrl } });
      closeCropper();
      toast({ title: "프로필 이미지가 변경되었습니다." });
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: "이미지 변경에 실패했습니다.", description: error.message, variant: "destructive" });
      }
    }
  };

  //저장 → 닉네임이 바뀌었을 때만 업데이트 (커스텀 키에 저장해야 소셜 재로그인 시 프로바이더 이름으로 원복되지 않음)
  const onSubmit = async (data: NicknameType) => {
    if (data.nickname === getDisplayName(session?.user)) {
      onClose();
      return;
    }

    try {
      await updateNickname(data.nickname);
      await updateUserAndRefresh({ data: { nickname: data.nickname } });
      toast({ title: "닉네임이 변경 되었습니다." });
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast({ title: "닉네임 변경에 실패했습니다.", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-3xl p-7">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">프로필 수정</DialogTitle>
          <DialogDescription className="sr-only">아바타와 닉네임을 수정할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 아바타 */}
          <div className="flex flex-col items-center gap-2 py-1">
            <input onChange={handleImgChange} type="file" accept="image/*" ref={inputRef} className="hidden" />
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative rounded-full"
              aria-label="프로필 사진 변경"
            >
              <UserAvatar size="xl" className="!w-[88px] !h-[88px]" />
              <span
                className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 border-2 border-card"
                aria-hidden="true"
              >
                <Camera size={13} className="text-gray-50" />
              </span>
            </button>
            <p className="text-xs text-gray-400">사진을 눌러 변경 · 업로드 후 바로 크롭할 수 있어요</p>
            <ImageCropper
              imageSrc={src}
              isOpen={isCropperOpen}
              defaultImage={getAvatarUrl(session?.user)}
              onClose={closeCropper}
              onSave={handleSaveImage}
            />
          </div>
          {/* 닉네임 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="profile-nickname" className="text-[13px] font-semibold">
                닉네임
              </label>
              <span className="text-[11px] text-gray-400">{nickname.length} / 6</span>
            </div>
            <input
              {...register("nickname")}
              id="profile-nickname"
              type="text"
              maxLength={6}
              className="h-11 rounded-lg border border-purple-300 bg-transparent px-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-200"
            />
            {errors.nickname ? (
              <p className="text-xs text-red">{errors.nickname.message}</p>
            ) : (
              <p className="text-xs text-gray-400">2~6자, 공백 없이 입력해주세요</p>
            )}
          </div>
          {/* 이메일 (읽기 전용) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">이메일</span>
            <div className="flex h-11 items-center justify-between rounded-lg bg-gray-100 px-3.5">
              <span className="text-sm text-gray-400">{session?.user.email}</span>
              <Lock size={14} className="text-gray-300" aria-hidden="true" />
            </div>
          </div>
          {/* 액션 */}
          <div className="mt-1 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[46px] rounded-full border border-gray-300 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-[46px] rounded-full bg-purple-300 text-sm font-bold text-white hover:bg-purple-400 transition-colors disabled:opacity-50"
            >
              저장하기
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
