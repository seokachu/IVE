import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import BoardWriteSkeleton from "@/components/common/loading/BoardWriteSkeleton";
import { getQuillModules } from "./getQuillModules";

// ReactQuill은 SSR이 안 되므로 dynamic import로 처리
const ReactQuill = dynamic(async () => await import("react-quill"), {
  ssr: false,
  loading: () => <BoardWriteSkeleton />,
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const QuillEditor = ({ value, onChange, error }: QuillEditorProps) => {
  const modules = useMemo(() => getQuillModules(), []);

  return (
    <div className="overflow-hidden">
      <ReactQuill
        onChange={onChange}
        modules={modules}
        value={value}
        className={error ? "quill-error" : ""}
        placeholder="내용을 입력해 주세요."
      />
      {error && <span className="text-destructive text-xs px-3">{error}</span>}
    </div>
  );
};

export default QuillEditor;
