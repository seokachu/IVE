import { NextResponse } from "next/server";
import {
  MEMBERSHIP_PRICES,
  chargeBilling,
  getAdminClient,
  getAuthUser,
  getNextBillingDate,
  issueBillingKey,
} from "@/lib/membership/billing";

//DIVE 멤버십 구독 시작 — authKey로 빌링키 발급 → 첫 결제 → memberships upsert
export async function POST(request: Request) {
  try {
    const { authKey, tier } = await request.json();
    const plan = MEMBERSHIP_PRICES[tier];
    if (!authKey || !plan) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

    //빌링키 발급 후 첫 결제
    const { billingKey, cardCompany, cardNumber } = await issueBillingKey(authKey, user.id);
    await chargeBilling({ billingKey, customerKey: user.id, amount: plan.price, orderName: plan.orderName });

    const { error } = await admin.from("memberships").upsert(
      {
        user_id: user.id,
        tier,
        status: "active",
        price: plan.price,
        billing_key: billingKey,
        customer_key: user.id,
        card_company: cardCompany,
        card_number: cardNumber,
        started_at: new Date().toISOString(),
        next_billing_at: getNextBillingDate().toISOString(),
        canceled_at: null,
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "구독 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
