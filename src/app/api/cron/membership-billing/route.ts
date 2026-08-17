import { NextRequest, NextResponse } from "next/server";
import { MEMBERSHIP_PRICES, chargeBilling, getAdminClient, getNextBillingDate } from "@/lib/membership/billing";

export const dynamic = "force-dynamic";

//매일 Vercel Cron이 호출 — 결제일이 지난 active 구독을 빌링키로 자동 결제
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "인증에 실패했습니다." }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

  const { data: due, error } = await admin
    .from("memberships")
    .select("*")
    .eq("status", "active")
    .lte("next_billing_at", new Date().toISOString());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let charged = 0;
  let failed = 0;

  for (const membership of due || []) {
    //다운그레이드 예약이 있으면 이번 주기부터 그 플랜으로 결제한다
    const tier = membership.pending_tier ?? membership.tier;
    const plan = MEMBERSHIP_PRICES[tier];
    try {
      await chargeBilling({
        billingKey: membership.billing_key,
        customerKey: membership.customer_key,
        amount: plan.price,
        orderName: plan.orderName,
      });
      await admin
        .from("memberships")
        .update({
          tier,
          price: plan.price,
          pending_tier: null,
          next_billing_at: getNextBillingDate(new Date(membership.next_billing_at)).toISOString(),
        })
        .eq("id", membership.id);
      charged += 1;
    } catch {
      //결제 실패 시 구독 종료 처리 — next_billing_at이 이미 지났으므로 혜택도 즉시 종료됨
      await admin
        .from("memberships")
        .update({ status: "canceled", canceled_at: new Date().toISOString() })
        .eq("id", membership.id);
      failed += 1;
    }
  }

  return NextResponse.json({ ok: true, charged, failed });
}
