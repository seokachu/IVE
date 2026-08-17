"use client";

import "@/styles/tiptap.css";
import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  TextQuote,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const ToolbarButton = ({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`w-[30px] h-[30px] rounded-md flex items-center justify-center transition-colors ${
      active
        ? "bg-purple-100 text-purple-500"
        : "text-gray-500 hover:bg-gray-200/70 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <span className="w-px h-[18px] mx-1 bg-gray-200" aria-hidden="true" />
);

const uploadImage = async (editor: Editor) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const safeFileName = file.name.replace(/[^a-z0-9.]/gi, "_");
    const filePath = `board/${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
      .from("boards")
      .upload(filePath, file);

    if (error) {
      toast({
        title: "이미지 업로드 실패",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const imageUrl = supabase.storage.from("boards").getPublicUrl(filePath)
      .data.publicUrl;

    editor.chain().focus().setImage({ src: imageUrl }).run();
  };
};

const setLink = (editor: Editor) => {
  if (editor.isActive("link")) {
    editor.chain().focus().unsetLink().run();
    return;
  }
  const url = window.prompt("연결할 주소를 입력해 주세요");
  if (!url) return;
  editor.chain().focus().setLink({ href: url }).run();
};

const TiptapEditor = ({ value, onChange, error }: TiptapEditorProps) => {
  const isInternalChange = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "다이브와 나누고 싶은 이야기를 자유롭게 적어 주세요.",
      }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: {
        "aria-label": "본문 입력",
      },
    },
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  // 수정 모드에서 기존 글이 비동기로 로드되면 에디터에 반영
  useEffect(() => {
    if (!editor) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (value !== (editor.isEmpty ? "" : editor.getHTML())) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const characters = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div>
      <div
        className={`board-editor rounded-xl border bg-white dark:bg-[#1E1E21] overflow-hidden transition-colors ${
          error ? "border-destructive" : "border-gray-300 focus-within:border-purple-300"
        }`}
      >
        <div className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto px-3 py-[9px] bg-gray-50 dark:bg-[#1A1A1D]">
          <ToolbarButton
            label="굵게"
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="기울임"
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="밑줄"
            active={editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <Underline size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="취소선"
            active={editor?.isActive("strike")}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            label="글머리 기호"
            active={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="번호 목록"
            active={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="인용구"
            active={editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <TextQuote size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            label="링크"
            active={editor?.isActive("link")}
            onClick={() => editor && setLink(editor)}
          >
            <Link2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="이미지"
            onClick={() => editor && uploadImage(editor)}
          >
            <ImageIcon size={16} />
          </ToolbarButton>
        </div>
        <hr className="border-gray-200" />
        <EditorContent editor={editor} />
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <ImageIcon size={13} />
            이미지는 툴바의 사진 버튼으로 추가할 수 있어요
          </span>
          <span className="text-xs text-gray-400 tabular-nums">
            {characters.toLocaleString()}자
          </span>
        </div>
      </div>
      {error && <span className="text-destructive text-xs px-3">{error}</span>}
    </div>
  );
};

export default TiptapEditor;
