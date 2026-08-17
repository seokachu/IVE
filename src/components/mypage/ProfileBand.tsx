"use client";
import { useState } from "react";
import Link from "next/link";
import _ from "lodash";
import { Camera, Pencil } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import ProfileEditModal from "@/components/mypage/ProfileEditModal";
import { useWishLists } from "@/hooks/queries/useWishList";
import { useMyBoards } from "@/hooks/queries/useBoard";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { useSession } from "@/store/zustand";
import { cn } from "@/utils/utils";

//프로필 밴드 — 아바타·닉네임·멤버십 뱃지·스탯 3종 (.pen 마이페이지 시안의 ProfileBand)
const ProfileBand = () => {
  const session = useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: wishlists } = useWishLists(session?.user.id);
  const { data: myBoards } = useMyBoards(session?.user.id);
  const { data: orderItems } = useOrderItems(session?.user.id);
  const { tier } = useMyMembership();

  const orderCount = Object.keys(_.groupBy(orderItems || [], "order_id")).length;

  const stats = [
    { label: "찜한 굿즈", value: wishlists?.length ?? 0, path: "/mypage/wishlist" },
    { label: "주문 내역", value: orderCount, path: "/mypage/orders" },
    { label: "작성한 글", value: myBoards?.length ?? 0, path: "/mypage/posts" },
  ];

  return (
    <div className="border-b border-gray-200 bg-purple-50">
      <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8 lg:py-9">
        <div className="flex items-center gap-4 lg:gap-5">
          {/* 아바타 + 카메라 뱃지 → 프로필 수정 모달 (구독자는 퍼플 링) */}
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="relative shrink-0 rounded-full"
            aria-label="프로필 수정"
          >
            <UserAvatar
              size="xl"
              className={cn(
                "!w-[72px] !h-[72px] lg:!w-[88px] lg:!h-[88px]",
                tier !== "free" && "ring-2 ring-purple-300 ring-offset-2 ring-offset-purple-50",
              )}
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-gray-900"
              aria-hidden="true"
            >
              <Camera size={13} className="text-gray-50" />
            </span>
          </button>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-bold leading-tight lg:text-[22px]">{session?.user.user_metadata.name}</h1>
              <MembershipBadge tier={tier} size="lg" />
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-white/60 dark:hover:bg-white/10"
              >
                <Pencil size={12} aria-hidden="true" />
                <span className="hidden sm:inline">프로필 </span>수정
              </button>
            </div>
            <p className="text-[13px] text-gray-400">{session?.user.email}</p>
          </div>
        </div>
        {/* 스탯 3종 — 모바일은 밴드 전체 폭에 균등 배치 (.pen 모바일 시안) */}
        <div className="flex w-full items-center justify-around lg:w-auto lg:justify-normal lg:gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-6 lg:gap-8">
              {index > 0 && <span className="h-9 w-px bg-gray-200" aria-hidden="true" />}
              <Link href={stat.path} className="group flex flex-col items-center gap-0.5">
                <strong className="text-xl font-bold leading-tight group-hover:text-purple-500 transition-colors">
                  {stat.value}
                </strong>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {isEditOpen && <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />}
    </div>
  );
};

export default ProfileBand;
