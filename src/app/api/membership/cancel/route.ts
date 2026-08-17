import { NextResponse } from "next/server";
import { getAdminClient, getAuthUser } from "@/lib/membership/billing";

//DIVE 멤버십 해지 — 다음 결제일까지 혜택 유지 (status만 canceled로)
export async function POST() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

    const { error } = await admin
      .from("memberships")
      .update({ status: "canceled", canceled_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("status", "active");
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "해지 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
