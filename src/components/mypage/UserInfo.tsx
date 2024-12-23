"use client";
import { sessionState } from "@/store";
import { useRecoilState } from "recoil";
import UserAvatar from "../common/UserAvatar";
import Link from "next/link";
import { MYPAGE_GNB_ARRAY } from "@/utils/constants";
import { usePathname } from "next/navigation";
import ActionButton from "../common/button/ActionButton";
import { ChangeEvent, useRef, useState } from "react";
import { updateNickname } from "@/lib/supabase/auth";
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NicknameType, userSchemas } from "@/hooks/user";
import ImageCropper from "../common/ImageCropper";
import { uploadAvatar } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";
import { PiUploadSimpleBold } from "react-icons/pi";
import { useWishLists } from "@/hooks/queries/useWishList";

const UserInfo = () => {
  const [session, setSession] = useRecoilState(sessionState);
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: userWishList } = useWishLists(session?.user.id);

  const wishlist = userWishList?.length;

  //하위 경로 포함 체크 active
  const isActivePath = (path: string, exact: boolean) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const form = useForm<NicknameType>({
    mode: "onChange",
    resolver: zodResolver(userSchemas.myPageNicknameSchema),
    defaultValues: { nickname: session?.user.user_metadata.name || "" },
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const onSubmit = async (data: NicknameType) => {
    if (data.nickname === session?.user.user_metadata.name) {
      setError("nickname", {
        type: "manual",
        message: "변경된 닉네임이 없습니다.",
      });
      return;
    }

    try {
      await updateNickname(data.nickname);

      if (session) {
        setSession({
          ...session,
          user: {
            ...session.user,
            user_metadata: {
              ...session.user.user_metadata,
              name: data.nickname,
            },
          },
        });
        toast({ title: "닉네임이 변경 되었습니다." });
      }
      setIsEditingNickname(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "닉네임 변경에 실패했습니다.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  //닉네임 변경
  const handleNicknameChange = () => {
    if (!isEditingNickname) {
      setIsEditingNickname(true);
      setValue("nickname", session?.user.user_metadata.name || "");
      clearErrors("nickname");
      return;
    }
    handleSubmit(onSubmit)();
  };

  //취소버튼
  const handleNicknameCancel = () => {
    setIsEditingNickname(false);
    clearErrors("nickname");
  };

  //아바타 클릭 시 이미지 변경
  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isModalOpen) {
      inputRef.current?.click();
    }
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSrc(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const handleSaveImage = async (blob: Blob) => {
    try {
      const avatarUrl = await uploadAvatar(blob);
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });
      if (error) throw error;

      const {
        data: { session: newSession },
      } = await supabase.auth.getSession();
      if (newSession) {
        setSession(newSession);
      }
      setIsModalOpen(false);
      toast({ title: "프로필 이미지가 변경되었습니다." });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "이미지 변경에 실패했습니다.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section>
      <div>
        <input
          onChange={handleImgChange}
          type="file"
          accept="image/*"
          ref={inputRef}
          className="hidden"
        />
        <div
          onClick={handleAvatarClick}
          className={`cursor-pointer relative ${
            isModalOpen ? "pointer-events-none" : ""
          }`}
        >
          <UserAvatar size="xl" />
          <ImageCropper
            imageSrc={src}
            isOpen={isModalOpen}
            defaultImage={session?.user.user_metadata.avatar_url}
            onClose={() => {
              setIsModalOpen(false);
              setSrc(null);
            }}
            onSave={handleSaveImage}
          />
          <div className="absolute top-2/3 left-10 bg-gray-800 bg-opacity-75 p-1 rounded-full m-1">
            <PiUploadSimpleBold color="white" />
          </div>
        </div>
        <div className="flex justify-between items-baseline mt-5 gap-2">
          {isEditingNickname ? (
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <Input
                {...register("nickname")}
                type="text"
                className="border rounded-md px-2 py-0"
                maxLength={6}
              />
              {errors.nickname && (
                <p className="text-xs ml-2 mt-1 text-red">
                  {errors.nickname.message}
                </p>
              )}
            </form>
          ) : (
            <h2 className="font-bold py-1">
              {session?.user.user_metadata.name}
            </h2>
          )}
          <div className="flex gap-1 whitespace-nowrap">
            <ActionButton
              onClick={handleNicknameChange}
              variant="primary"
              className="text-sm py-2 px-3"
            >
              {!isEditingNickname ? "수정" : "수정완료"}
            </ActionButton>
            {isEditingNickname && (
              <ActionButton
                onClick={handleNicknameCancel}
                variant="default"
                className="text-sm py-2 px-3"
              >
                취소
              </ActionButton>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-y p-5 my-5">
        <div className="w-2/4">
          <p className="text-xs text-[#495057] mb-1">글 작성수</p>
          <strong>-</strong>
        </div>
        <div className="w-2/4">
          <p className="text-xs text-[#090a0a] mb-1">찜</p>
          <strong>{wishlist}</strong>
        </div>
      </div>
      <ul className="flex lg:flex-col gap-5 border-b lg:border-b-0 pb-5 text-center lg:text-left">
        {MYPAGE_GNB_ARRAY.map((el, index) => (
          <li key={index}>
            <Link
              href={el.path}
              className={`hover:font-bold ${
                isActivePath(el.path, el.exact) ? "font-bold" : ""
              }`}
            >
              {el.label}
            </Link>
          </li>
        ))}
        {/* <li>
          <button
            className="text-dark-gray text-sm"
          >
            회원탈퇴
          </button>
        </li> */}
      </ul>
    </section>
  );
};

export default UserInfo;
