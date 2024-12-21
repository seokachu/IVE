import { supabase } from "./client";

export const uploadAvatar = async (file: Blob) => {
  const fileExt = "png";
  const fileName = `avatar-${Date.now()}.${fileExt}`;

  try {
    // 새 이미지 업로드
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "0",
        contentType: "image/png",
      });

    if (uploadError) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Avatar 업로드 중 에러 발생: ${error.message}`);
    }
    throw error;
  }
};
