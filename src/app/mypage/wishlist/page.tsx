"use client";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import UserWishList from "@/components/mypage/wishlist/UserWishList";
import { useWishLists } from "@/hooks/queries/useWishList";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";

const WishListPage = () => {
  const session = useRecoilValue(sessionState);
  const {
    data: wishlists,
    isLoading,
    isSuccess,
  } = useWishLists(session?.user.id);

  if (isLoading || !isSuccess) return <MyPageLoading title="찜 목록" />;

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:pr-5 lg:pl-8">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">찜 목록</h2>
      </div>
      {wishlists ? (
        <UserWishList wishlists={wishlists} />
      ) : (
        <div className="flex items-center justify-center w-full h-[200px] lg:h-[500px]">
          <h3>찜 목록이 없습니다.</h3>
        </div>
      )}
    </div>
  );
};

export default WishListPage;
