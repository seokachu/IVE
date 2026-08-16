import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import RenderStars from "@/utils/RenderStars";
import type { ReviewItemProps } from "@/types/shop";

//시안 기준: 프로필 사진 대신 파스텔 서클 + 이름 첫 글자 이니셜 아바타
//브랜드 램프 내 파스텔 조합을 이름 해시로 배정 — 같은 유저는 항상 같은 색
const AVATAR_STYLES = [
  "bg-purple-100 text-purple-500",
  "bg-orange-100 text-orange-500",
  "bg-gray-100 text-gray-600",
  "bg-purple-50 text-purple-400",
] as const;

const ReviewItem = ({ item }: ReviewItemProps) => {
  //프로필 이미지가 있으면 그대로, 없거나 로드 실패(카카오·구글 깨진 기본 이미지 포함)면 이니셜 폴백
  const [imageError, setImageError] = useState(false);
  const userName = item.user.name || "익명";
  const nameHash = [...userName].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const avatarStyle = AVATAR_STYLES[nameHash % AVATAR_STYLES.length];
  const showImage = Boolean(item.user.avatar_url) && !imageError;

  return (
    <li className="border-b py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showImage ? (
            <Image
              src={item.user.avatar_url!}
              alt={`${userName} 프로필 이미지`}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span
              aria-hidden
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${avatarStyle}`}
            >
              {userName.slice(0, 1)}
            </span>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{userName}</h3>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <RenderStars rating={item.rating} size={12} />
              </div>
              <strong className="text-xs text-gray-500">{item.rating}.0</strong>
            </div>
          </div>
        </div>
        <time className="text-xs text-gray-400">{formatDate(item.created_at)}</time>
      </div>
      <p className="mt-3 pl-[52px] text-sm leading-relaxed text-gray-500">{item.content}</p>
    </li>
  );
};

export default ReviewItem;
