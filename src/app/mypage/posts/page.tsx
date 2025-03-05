"use client";
import Error from "@/components/common/error/Error";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import PostList from "@/components/mypage/posts/PostList";
import { useMyBoards } from "@/hooks/queries/useBoard";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";

const PostPage = () => {
  const session = useRecoilValue(sessionState);
  const { data, isLoading, isError } = useMyBoards(session?.user?.id);

  if (isLoading) return <MyPageLoading title="내가 쓴 글" />;
  if (isError) return <Error />;

  const isEmpty = data?.length === 0;

  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">내가 쓴 글</h2>
      </div>
      {!isEmpty ? (
        <PostList posts={data} />
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-[500px]">
          <h3>작성한 게시글이 없습니다.</h3>
        </div>
      )}
    </div>
  );
};

export default PostPage;
