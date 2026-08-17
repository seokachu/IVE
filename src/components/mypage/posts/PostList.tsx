import PostListItem from "./PostListItem";
import type { PostListProps } from "@/types/mypage";

//내가 쓴 글 리스트 — 라운드 박스 안에 로우 나열 (.pen "마이페이지 · 내가 쓴 글" 시안)
const PostList = ({ posts = [] }: PostListProps) => {
  return (
    <ul className="overflow-hidden rounded-2xl border border-gray-200">
      {posts.map((item, index) => (
        <PostListItem key={item.id} item={item} isLast={index === posts.length - 1} />
      ))}
    </ul>
  );
};

export default PostList;
