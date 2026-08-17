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

//해지 취소 — 혜택 기간이 남아 있으면 추가 결제 없이 다시 active로 되돌린다
export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

    const { data: membership, error: readError } = await admin
      .from("memberships")
      .select("id, status, next_billing_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!membership) return NextResponse.json({ error: "구독 내역이 없습니다." }, { status: 404 });
    if (membership.status !== "canceled") {
      return NextResponse.json({ error: "해지 예정 상태가 아닙니다." }, { status: 400 });
    }
    //혜택 기간이 끝난 뒤에는 되돌릴 수 없다 — 새 결제(구독 시작)로만 재개
    if (new Date(membership.next_billing_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: "혜택 기간이 끝나 다시 구독해야 합니다." }, { status: 400 });
    }

    const { error } = await admin
      .from("memberships")
      .update({ status: "active", canceled_at: null })
      .eq("id", membership.id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, nextBillingAt: membership.next_billing_at });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "해지 취소 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
