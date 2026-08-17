import { NextResponse } from "next/server";
import { getAuthUser, getAdminClient } from "@/lib/supabase/server";

//회원탈퇴: auth 계정은 삭제하되 작성한 글·댓글은 보존한다.
//public.user 프로필 행을 "탈퇴한 회원"으로 익명화해 남기면 게시글/댓글의 작성자 조인이 그대로 동작한다.
//(supabase/account-deletion.sql로 public.user → auth.users FK를 제거해 둔 상태를 전제)
export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const admin = getAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "회원탈퇴 설정이 완료되지 않았습니다." }, { status: 500 });
    }

    //프로필 익명화 — email은 not null·중복 방지를 위해 재가입해도 충돌하지 않는 자리표시자로 교체
    const { error: anonymizeError } = await admin
      .from("user")
      .update({
        name: "탈퇴한 회원",
        avatar_url: null,
        email: `deleted-${user.id}@removed.invalid`,
      })
      .eq("id", user.id);
    if (anonymizeError) {
      console.error("프로필 익명화 실패:", anonymizeError);
      return NextResponse.json({ error: "회원탈퇴에 실패했습니다." }, { status: 500 });
    }

    //개인정보 성격의 데이터는 즉시 삭제 (약관: "회원 탈퇴 시까지" 보관)
    //글·댓글·좋아요는 보존, memberships·push_tokens는 auth.users cascade로도 정리되지만 명시적으로 지운다.
    const personalTables = ["shipping_addresses", "customer_info", "wish_lists", "push_tokens"] as const;
    for (const table of personalTables) {
      const { error } = await admin.from(table).delete().eq("user_id", user.id);
      if (error) console.error(`${table} 정리 실패:`, error);
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("계정 삭제 실패:", deleteError);
      return NextResponse.json({ error: "회원탈퇴에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    return NextResponse.json({ error: "회원탈퇴에 실패했습니다." }, { status: 500 });
  }
}
