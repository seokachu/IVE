import { NextResponse } from "next/server";
import { getAdminClient, getAuthUser, issueBillingKey } from "@/lib/membership/billing";

//결제 수단 변경 — 새 authKey로 빌링키 재발급, 다음 결제일부터 새 카드로 결제
export async function POST(request: Request) {
  try {
    const { authKey } = await request.json();
    if (!authKey) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

    const { billingKey, cardCompany, cardNumber } = await issueBillingKey(authKey, user.id);

    const { error, count } = await admin
      .from("memberships")
      .update(
        { billing_key: billingKey, card_company: cardCompany, card_number: cardNumber },
        { count: "exact" },
      )
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
    if (!count) return NextResponse.json({ error: "구독 중인 멤버십이 없습니다." }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "결제 수단 변경 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
