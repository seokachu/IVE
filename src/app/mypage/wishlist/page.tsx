"use client";
import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import SortDropdown from "@/components/common/select/SortDropdown";
import MyPageEmptyState from "@/components/mypage/MyPageEmptyState";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import UserWishList from "@/components/mypage/wishlist/UserWishList";
import { useWishLists } from "@/hooks/queries/useWishList";
import { useSession } from "@/store/zustand";

const WISHLIST_SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
] as const;

const WishListPage = () => {
  const session = useSession();
  const [sort, setSort] = useState<string>("latest");
  const { data: wishlists, isLoading, isSuccess } = useWishLists(session?.user.id);

  const sortedWishlists = useMemo(() => {
    const list = [...(wishlists || [])];
    list.sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sort === "latest" ? diff : -diff;
    });
    return list;
  }, [wishlists, sort]);

  if (isLoading || !isSuccess) return <MyPageLoading title="찜 목록" variant="grid" />;

  const isEmpty = sortedWishlists.length === 0;

  return (
    <div>
      <MyPageTitle title="찜 목록" count={sortedWishlists.length}>
        {!isEmpty && <SortDropdown options={WISHLIST_SORT_OPTIONS} value={sort} onChange={setSort} />}
      </MyPageTitle>
      {isEmpty ? (
        <MyPageEmptyState icon={Heart} title="아직 찜한 굿즈가 없어요" description="굿즈샵에서 마음에 드는 굿즈를 담아보세요">
          <Link
            href="/shop"
            className="inline-flex h-10 items-center rounded-full bg-purple-300 px-5 text-[13px] font-bold text-white transition-colors hover:bg-purple-400"
          >
            굿즈샵 구경 가기
          </Link>
        </MyPageEmptyState>
      ) : (
        <UserWishList wishlists={sortedWishlists} />
      )}
    </div>
  );
};

export default WishListPage;
