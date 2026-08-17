"use client";
import { FileText } from "lucide-react";
import Link from "next/link";
import Error from "@/components/common/error/Error";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import MyPageEmptyState from "@/components/mypage/MyPageEmptyState";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import PostList from "@/components/mypage/posts/PostList";
import { useMyBoards } from "@/hooks/queries/useBoard";
import { useSession } from "@/store/zustand";

const PostPage = () => {
  const session = useSession();
  const { data, isLoading, isError } = useMyBoards(session?.user?.id);

  if (isLoading) return <MyPageLoading title="내가 쓴 글" />;
  if (isError) return <Error />;

  const isEmpty = data?.length === 0;

  return (
    <div>
      <MyPageTitle title="내가 쓴 글" count={data?.length ?? 0} />
      {isEmpty ? (
        <MyPageEmptyState icon={FileText} title="작성한 게시글이 없습니다" description="팬 게시판에 첫 글을 남겨보세요">
          <Link
            href="/board/write"
            className="inline-flex h-10 items-center rounded-full bg-purple-300 px-5 text-[13px] font-bold text-white transition-colors hover:bg-purple-400"
          >
            첫 글 쓰러 가기
          </Link>
        </MyPageEmptyState>
      ) : (
        <PostList posts={data} />
      )}
    </div>
  );
};

export default PostPage;
