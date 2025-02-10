import type { BoardDetailProps } from "@/types";
import "react-quill/dist/quill.snow.css";
import "@/styles/quill.css";

const BoardDetailContent = ({ item }: BoardDetailProps) => {
  return (
    <div className="pt-5 pb-14">
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: item?.content ?? "" }}
      />
    </div>
  );
};

export default BoardDetailContent;
