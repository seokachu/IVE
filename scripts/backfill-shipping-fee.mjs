/**
 * payments.shipping_fee를 주문 상품 구성에서 되계산해 채운다.
 *
 * shipping_fee 컬럼(supabase/shipping.sql)이 생기기 전에 넣은 주문은 배송비가
 * amount에만 녹아 있고 컬럼은 0이라, 주문 상세에서 배송비가 전부 "무료"로 보인다.
 * 시드 주문은 계산 규칙이 동일하므로 order_items로 그대로 복원할 수 있다.
 *
 * 실제 결제로 들어온 주문은 amount와 어긋날 수 있어 건드리지 않는다 —
 * amount가 (상품 합계 + 되계산한 배송비)와 일치하는 주문만 채운다.
 *
 * 실행: pnpm shipping:backfill
 *       pnpm shipping:backfill --dry-run
 */
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");

//src/utils/constants의 SHIPPING_POLICY와 맞춰야 한다
const SHIPPING = { BASE_FEE: 3000, FREE_THRESHOLD: 30000 };
const FREE_SHIPPING_LABEL = "무료배송";

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

const rest = async (path, init = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
};

const discounted = (price, rate) => Math.floor((price - price * ((rate ?? 0) / 100)) / 10) * 10;

//calculateShipping과 같은 규칙 — 전 품목 무료배송이면 면제, 아니면 기준 금액 이상일 때만 무료
const shippingFeeFor = (items, amount) => {
  if (items.every((item) => item.shipping_type === FREE_SHIPPING_LABEL)) return 0;
  return amount >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.BASE_FEE;
};

const main = async () => {
  const [payments, orderItems] = await Promise.all([
    rest("payments?select=id,order_id,amount,shipping_fee&limit=1000"),
    rest("order_items?select=order_id,price,quantity,discount_rate,shipping_type&limit=2000"),
  ]);

  const itemsByOrder = orderItems.reduce((acc, item) => {
    (acc[item.order_id] ??= []).push(item);
    return acc;
  }, {});

  const updates = [];
  const skipped = { 이미채워짐: 0, 상품없음: 0, 금액불일치: 0, 배송비0: 0 };

  for (const payment of payments) {
    if (payment.shipping_fee > 0) {
      skipped.이미채워짐++;
      continue;
    }
    const items = itemsByOrder[payment.order_id];
    if (!items?.length) {
      skipped.상품없음++;
      continue;
    }

    const productAmount = items.reduce((sum, item) => sum + discounted(item.price, item.discount_rate) * item.quantity, 0);
    const fee = shippingFeeFor(items, productAmount);
    if (fee === 0) {
      skipped.배송비0++;
      continue;
    }

    //amount가 되계산 결과와 맞아야 시드 주문이라고 확신할 수 있다
    if (Number(payment.amount) !== productAmount + fee) {
      skipped.금액불일치++;
      continue;
    }
    updates.push({ id: payment.id, order_id: payment.order_id, fee, amount: Number(payment.amount) });
  }

  console.log(`결제 ${payments.length}건 · 채울 대상 ${updates.length}건`);
  console.log(
    `건너뜀 — 이미 채워짐 ${skipped.이미채워짐} · 배송비 0원(무료) ${skipped.배송비0} · 금액 불일치 ${skipped.금액불일치} · 주문상품 없음 ${skipped.상품없음}`
  );
  updates.slice(0, 10).forEach((u) => console.log(`  ${u.order_id}  ${u.amount.toLocaleString()}원 중 배송비 ${u.fee.toLocaleString()}원`));
  if (updates.length > 10) console.log(`  … 외 ${updates.length - 10}건`);

  if (DRY_RUN) {
    console.log("\n[dry-run] 반영 없이 종료합니다");
    return;
  }

  for (const u of updates) {
    await rest(`payments?id=eq.${u.id}`, { method: "PATCH", body: JSON.stringify({ shipping_fee: u.fee }) });
  }
  console.log(`\n${updates.length}건 반영 완료`);
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
