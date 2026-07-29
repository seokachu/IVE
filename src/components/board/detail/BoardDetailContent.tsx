import "react-quill-new/dist/quill.snow.css";
import "@/styles/quill.css";
import DOMPurify from "isomorphic-dompurify";
import type { BoardDetailProps } from "@/types/board";

const BoardDetailContent = ({ item }: BoardDetailProps) => {
  return (
    <div className="py-5">
      <div className="ql-editor ql-snow board-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.content ?? "") }} />
    </div>
  );
};

export default BoardDetailContent;
