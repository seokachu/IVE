import type { BoardDetailProps } from "@/types";
import "react-quill/dist/quill.snow.css";
import "@/styles/quill.css";

const BoardDetailContent = ({ item }: BoardDetailProps) => {
  return (
    <div className="py-5">
      <div
        className="ql-editor ql-snow"
        dangerouslySetInnerHTML={{ __html: item?.content ?? "" }}
      />
    </div>
  );
};

export default BoardDetailContent;
