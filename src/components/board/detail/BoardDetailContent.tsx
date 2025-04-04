import "react-quill/dist/quill.snow.css";
import "@/styles/quill.css";
import type { BoardDetailProps } from "@/types/board";

const BoardDetailContent = ({ item }: BoardDetailProps) => {
  return (
    <div className="py-5">
      <div className="ql-editor ql-snow board-view" dangerouslySetInnerHTML={{ __html: item?.content ?? "" }} />
    </div>
  );
};

export default BoardDetailContent;
