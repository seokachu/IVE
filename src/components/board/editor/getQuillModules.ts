import { supabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import type Quill from "quill";

export const getQuillModules = () => {
  return {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        ["image"],
      ],
      handlers: {
        image: async function (this: { quill: Quill }) {
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

            const imageUrl = supabase.storage
              .from("boards")
              .getPublicUrl(filePath).data.publicUrl;

            const range = this.quill.getSelection();
            if (!range) return;

            this.quill.insertEmbed(range.index, "image", imageUrl);
          };
        },
      },
    },
  };
};
