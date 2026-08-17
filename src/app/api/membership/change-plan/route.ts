import { NextResponse } from "next/server";
import { MEMBERSHIP_PRICES, chargeBilling, getAdminClient, getAuthUser } from "@/lib/membership/billing";
import { MIN_CHARGE_AMOUNT, getProratedUpgradeAmount } from "@/utils/calculateProration";

//플랜 변경 — 업그레이드는 남은 기간 차액을 즉시 결제하고 바로 반영, 다운그레이드는 다음 결제일로 예약(pending_tier)
export async function POST(request: Request) {
  try {
    const { tier } = await request.json();
    const plan = MEMBERSHIP_PRICES[tier];
    if (!plan) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

    const { data: membership, error: readError } = await admin
      .from("memberships")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!membership) return NextResponse.json({ error: "구독 중인 멤버십이 없습니다." }, { status: 404 });
    if (membership.status !== "active") {
      return NextResponse.json({ error: "해지 예정 상태에서는 플랜을 변경할 수 없습니다." }, { status: 400 });
    }
    if (membership.tier === tier) {
      return NextResponse.json({ error: "이미 이용 중인 플랜입니다." }, { status: 400 });
    }

    //다운그레이드 — 결제·환불 없이 예약만, 다음 결제일에 크론이 반영한다
    if (plan.price < membership.price) {
      const { error } = await admin.from("memberships").update({ pending_tier: tier }).eq("id", membership.id);
      if (error) throw new Error(error.message);

      return NextResponse.json({ ok: true, scheduled: true, appliesAt: membership.next_billing_at });
    }

    //업그레이드 — 남은 기간만큼의 차액만 저장된 빌링키로 즉시 결제 (다음 결제일은 그대로)
    const amount = getProratedUpgradeAmount(membership.price, plan.price, membership.next_billing_at);
    if (amount >= MIN_CHARGE_AMOUNT) {
      await chargeBilling({
        billingKey: membership.billing_key,
        customerKey: membership.customer_key,
        amount,
        orderName: `${plan.orderName} 업그레이드 차액`,
      });
    }

    const { error } = await admin
      .from("memberships")
      .update({ tier, price: plan.price, pending_tier: null })
      .eq("id", membership.id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, scheduled: false, charged: amount >= MIN_CHARGE_AMOUNT ? amount : 0 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "플랜 변경 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

//다운그레이드 예약 취소 — 다음 결제일 전까지 되돌릴 수 있다
export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

    const admin = getAdminClient();
    if (!admin) return NextResponse.json({ error: "멤버십 설정이 완료되지 않았습니다." }, { status: 500 });

    const { error } = await admin.from("memberships").update({ pending_tier: null }).eq("user_id", user.id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "예약 취소 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
