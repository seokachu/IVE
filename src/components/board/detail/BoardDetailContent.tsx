import "@/styles/board-content.css";
import DOMPurify from "isomorphic-dompurify";
import type { BoardDetailProps } from "@/types/board";

const BoardDetailContent = ({ item }: BoardDetailProps) => {
  return (
    <div>
      <div className="board-view" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.content ?? "") }} />
    </div>
  );
};

export default BoardDetailContent;
