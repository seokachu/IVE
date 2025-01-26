import { supabase } from "./client";

export const uploadAvatar = async (file: Blob) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("인증된 사용자가 아닙니다.");

  const fileExt = file.type.split("/")[1];
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  try {
    // 새 이미지 업로드
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "0",
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("user")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Avatar 업로드 중 에러 발생: ${error.message}`);
    }
    throw error;
  }
};
