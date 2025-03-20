import PostListItem from './PostListItem';
import type { PostListProps } from '@/types/mypage';

const PostList = ({ posts = [] }: PostListProps) => {
  return (
    <ul className="space-y-4 mt-5">
      {posts.map((item) => (
        <PostListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default PostList;
