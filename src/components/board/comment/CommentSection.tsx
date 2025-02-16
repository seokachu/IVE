import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const CommentSection = () => {
  return (
    <>
      <CommentForm mode="create" />
      <CommentList />
    </>
  );
};

export default CommentSection;
