import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const CommentSection = () => {
  return (
    <>
      <CommentForm mode="create" type="comment" />
      <CommentList />
    </>
  );
};

export default CommentSection;
