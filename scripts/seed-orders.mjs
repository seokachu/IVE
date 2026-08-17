/**
 * 주문·결제·리뷰를 전부 지우고 굿즈샵 전 상품에 고르게 다시 만든다.
 *
 * 기존 문제
 * - 상품 66개 중 리뷰가 달린 건 11개뿐이라 55개가 별점 0으로 표시되고,
 *   review_count로 정렬하는 "인기순"에서 55개가 전부 동점이었다
 * - 주문 71건이 유저 9명에 몰려 있고 delivery_status가 전부 "배송전"이었다
 *
 * 생성 규칙
 * - 모든 상품이 최소 MIN_REVIEWS_PER_GOODS건의 리뷰를 갖도록 먼저 배분하고, 인기 상품에 가중치를 더한다
 * - 주문 날짜는 상품 등록일 이후 ~ 오늘 사이 (발매 전에 산 주문이 생기지 않게)
 * - delivery_status는 주문 경과일로 정한다 — 배송전(2일 미만) / 배송중(2~6일) / 배송완료(7일 이상)
 * - is_confirmed는 배송완료 후 3일이 지난 건만 true. 리뷰는 확정된 주문에만 달린다
 * - 결제 금액은 실제 장바구니와 같은 규칙 (상품 할인 → 배송비)으로 계산한다
 *
 * 실행: pnpm orders:seed
 *       pnpm orders:seed --dry-run
 */
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";
import { buildReview } from "./data/goods-review-pool.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");

//src/utils/constants 의 SHIPPING_POLICY 와 맞춰야 한다
const SHIPPING = { BASE_FEE: 3000, FREE_THRESHOLD: 30000 };
const FREE_SHIPPING_LABEL = "무료배송";

const MIN_REVIEWS_PER_GOODS = 2;
//오래 팔린 상품에 얹는 추가 리뷰 — 상위 몇 개가 HOT 뱃지 기준(리뷰 10건 이상 & 평점 4.0 이상)을 넘게 한다
const STEADY_SELLERS = 15; //가중치를 받을 상품 수 (등록이 오래된 순)
const STEADY_TOP_BONUS = 13; //1위가 받는 추가 리뷰 수, 이후 선형 감쇠
const DAY = 24 * 60 * 60 * 1000;

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

//── 결정적 난수 — 재실행해도 같은 결과가 나오도록 시드 기반으로만 뽑는다
const mulberry = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

//상품마다 문장 풀의 다른 지점에서 시작하도록 — 인덱스만 쓰면 앞쪽 두세 문장만 반복된다
const hashOf = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (Math.imul(hash, 31) + text.charCodeAt(i)) | 0;
  return Math.abs(hash);
};

const NOW = new Date();
const ORDER_ID_ALPHABET = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const makeOrderId = (date, rand) => {
  const yyyymmdd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  let suffix = "";
  for (let i = 0; i < 8; i++) suffix += ORDER_ID_ALPHABET[Math.floor(rand() * ORDER_ID_ALPHABET.length)];
  return `${yyyymmdd}-${suffix}`;
};

const discounted = (price, rate) => Math.floor((price - price * ((rate ?? 0) / 100)) / 10) * 10;

//장바구니와 같은 규칙 — 전 품목 무료배송이면 면제, 아니면 기준 금액 이상일 때만 무료
const shippingFeeFor = (items, amount) => {
  if (items.every((item) => item.goods.shipping_type === FREE_SHIPPING_LABEL)) return 0;
  return amount >= SHIPPING.FREE_THRESHOLD ? 0 : SHIPPING.BASE_FEE;
};

const PAYMENT_METHODS = ["카드", "토스페이 간편결제", "카카오페이 간편결제", "네이버페이 간편결제", "카드"];

const main = async () => {
  const [goods, users, addresses, oldPayments, oldItems, oldReviews] = await Promise.all([
    rest("goods?select=id,title,price,discount_rate,shipping_type,delivery_info,size,color,thumbnail,created_at&limit=300"),
    rest("user?select=id,name&limit=100"),
    rest("shipping_addresses?select=*&limit=100"),
    rest("payments?select=*&limit=500"),
    rest("order_items?select=*&limit=1000"),
    rest("goods_reviews?select=*&limit=500"),
  ]);

  //주문자 풀 — 이름이 비어 있거나 물음표만 있는 계정은 제외
  const buyers = users.filter((u) => u.name && u.name.trim().length > 1 && !/^\?+$/.test(u.name));
  if (buyers.length === 0) throw new Error("주문자로 쓸 유저가 없습니다.");

  const addressByUser = new Map(addresses.map((a) => [a.user_id, a]));
  const fallbackAddress = addresses.find((a) => a.address_line1) ?? {
    recipient_name: "다이브",
    recipient_phone: "010-0000-0000",
    postal_code: "03709",
    address_line1: "서울 서대문구 수색로 100",
    address_line2: "",
  };

  //── 상품별 리뷰 목표 수: 모든 상품에 기본치를 깔고, 오래 팔린 상품일수록 리뷰가 누적되게 얹는다
  //   난수로 뽑으면 한 상품에 쏠려 나머지가 HOT 기준에 못 미치므로, 감쇠 사다리로 결정적으로 배분한다
  const targets = new Map(goods.map((g) => [g.id, MIN_REVIEWS_PER_GOODS]));
  const steady = [...goods].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  for (let i = 0; i < Math.min(STEADY_SELLERS, steady.length); i++) {
    const bonus = Math.max(1, Math.round(STEADY_TOP_BONUS * (1 - i / STEADY_SELLERS)));
    targets.set(steady[i].id, targets.get(steady[i].id) + bonus);
  }

  //── 리뷰 목표를 주문으로 환산 — 등록 시기가 비슷한 상품끼리 묶이도록 정렬 후 잘라 담는다
  //   (신상과 구상품이 한 주문에 섞이면 주문일이 신상 등록일 이후로 밀려 구상품 리뷰가 사라진다)
  const pending = [];
  for (const g of goods) {
    for (let i = 0; i < targets.get(g.id); i++) pending.push({ goods: g, seed: hashOf(g.id) + i * 7 });
  }
  pending.sort((a, b) => new Date(a.goods.created_at) - new Date(b.goods.created_at));

  const payments = [];
  const orderItems = [];
  const reviews = [];
  const usedOrderIds = new Set();
  let orderIndex = 0;

  //주문 한 건을 만들어 payments·order_items·reviews에 밀어 넣는다
  //ageHint를 주면 그 경과일(일)에 맞춰 주문일을 잡는다 — 최근 주문(배송전/배송중)을 만들 때 쓴다
  //상품별로 이미 리뷰를 쓴 유저 — 같은 사람 리뷰가 한 상품에 몰리지 않게 피한다
  const reviewersOf = new Map();

  const pushOrder = (lines, ageHint) => {
    const rand = mulberry(orderIndex * 7919 + 13);

    //담긴 상품에 아직 리뷰를 안 쓴 유저를 우선 고른다 (전부 썼으면 재구매로 보고 그냥 뽑는다)
    const fresh = buyers.filter((u) => lines.every((l) => !reviewersOf.get(l.goods.id)?.has(u.id)));
    const pool = fresh.length > 0 ? fresh : buyers;
    const buyer = pool[Math.floor(rand() * pool.length)];

    //담긴 상품 중 가장 늦게 등록된 것 이후로만 주문될 수 있다 (발매 전 구매 방지)
    const notBefore = Math.max(...lines.map((l) => new Date(l.goods.created_at).getTime()));
    let orderedAt;
    if (ageHint !== undefined) {
      orderedAt = new Date(Math.max(notBefore + DAY, NOW.getTime() - ageHint * DAY));
    } else {
      //제곱 분포로 발매 직후에 몰리게 — 실제 판매 곡선과 비슷하고, 구매확정까지 갈 시간도 확보된다
      const span = Math.max(NOW.getTime() - notBefore, DAY);
      const r = rand();
      orderedAt = new Date(notBefore + Math.floor(r * r * span));
    }

    let orderId = makeOrderId(orderedAt, rand);
    while (usedOrderIds.has(orderId)) orderId = makeOrderId(orderedAt, rand);
    usedOrderIds.add(orderId);

    const ageDays = (NOW.getTime() - orderedAt.getTime()) / DAY;
    const deliveryStatus = ageDays < 2 ? "배송전" : ageDays < 7 ? "배송중" : "배송완료";
    //배송완료 후 3일이 지나야 구매확정 — 리뷰는 확정된 건에만 달린다
    const isConfirmed = ageDays >= 10;

    const productAmount = lines.reduce((sum, line) => {
      const quantity = 1 + (rand() < 0.15 ? 1 : 0);
      line.quantity = quantity;
      return sum + discounted(line.goods.price, line.goods.discount_rate) * quantity;
    }, 0);
    const shippingFee = shippingFeeFor(lines, productAmount);
    const address = addressByUser.get(buyer.id) ?? fallbackAddress;

    payments.push({
      id: randomUUID(),
      user_id: buyer.id,
      order_id: orderId,
      amount: String(productAmount + shippingFee),
      order_name: `${lines[0].goods.title.trim()}${lines.length > 1 ? ` 외 ${lines.length - 1}건` : " 외 0건"}`,
      payment_method: PAYMENT_METHODS[Math.floor(rand() * PAYMENT_METHODS.length)],
      status: "결제 완료",
      delivery_status: deliveryStatus,
      installment_months: 0,
      recipient_name: address.recipient_name || buyer.name,
      recipient_phone: address.recipient_phone || "010-0000-0000",
      address_line1: address.address_line1,
      address_line2: address.address_line2 ?? "",
      postal_code: address.postal_code,
      created_at: orderedAt.toISOString(),
      shippingFee, //컬럼 존재 여부에 따라 아래에서 붙였다 뗀다
    });

    for (const line of lines) {
      orderItems.push({
        id: randomUUID(),
        order_id: orderId,
        product_id: line.goods.id,
        product_name: line.goods.title.trim(),
        product_image: line.goods.thumbnail,
        price: line.goods.price,
        quantity: line.quantity,
        user_id: buyer.id,
        shipping_type: line.goods.shipping_type,
        discount_rate: line.goods.discount_rate ?? 0,
        review_count: 0,
        size: line.goods.size,
        color: line.goods.color,
        delivery_info: line.goods.delivery_info,
        rating: null,
        is_confirmed: isConfirmed,
        created_at: orderedAt.toISOString(),
      });

      if (!isConfirmed) continue;

      if (!reviewersOf.has(line.goods.id)) reviewersOf.set(line.goods.id, new Set());
      reviewersOf.get(line.goods.id).add(buyer.id);

      const { rating, content } = buildReview(line.goods.title, line.seed);
      //리뷰는 구매확정 무렵(주문 후 10~20일)에 작성된 것으로
      const reviewedAt = new Date(orderedAt.getTime() + (10 + Math.floor(rand() * 10)) * DAY);
      reviews.push({
        id: randomUUID(),
        goods_id: line.goods.id,
        order_id: orderId,
        user_id: buyer.id,
        name: buyer.name,
        rating,
        content,
        created_at: (reviewedAt > NOW ? NOW : reviewedAt).toISOString(),
      });
    }

    orderIndex++;
    return { isConfirmed, orderedAt };
  };

  //정렬 결과에서 같은 상품 항목은 서로 붙어 있으므로, 한 주문에 같은 상품이 두 번 담기지 않게 건너뛴다
  //(리뷰 조회가 order_id + product_id 조합이라 중복되면 같은 사람이 같은 상품에 두 번 쓴 꼴이 된다)
  const queue = [...pending];
  while (queue.length > 0) {
    const size = 1 + Math.floor(mulberry(orderIndex * 31 + 5)() * 3); //1~3개
    const lines = [];
    const picked = new Set();

    for (let i = 0; i < queue.length && lines.length < size; i++) {
      if (picked.has(queue[i].goods.id)) continue;
      picked.add(queue[i].goods.id);
      lines.push(queue.splice(i, 1)[0]);
      i--;
    }

    pushOrder(lines);
  }

  //── 보정 1: 등록 14일이 지났는데도 리뷰가 안 붙은 상품은 단독 주문으로 한 건 더 만든다
  //구매확정까지 10일이 걸리므로, 등록 12일이 지난 상품부터는 리뷰가 하나는 있어야 한다
  const REVIEWABLE_AFTER_DAYS = 12;
  const countReviews = (id) => reviews.filter((r) => r.goods_id === id).length;
  for (const g of goods) {
    const registeredDays = (NOW.getTime() - new Date(g.created_at).getTime()) / DAY;
    if (registeredDays < REVIEWABLE_AFTER_DAYS || countReviews(g.id) > 0) continue;
    //발매 직후 주문 → 반드시 구매확정 구간에 들어간다
    pushOrder([{ goods: g, seed: hashOf(g.id) + 3 }], Math.min(registeredDays - 1, 45));
  }

  //── 보정 2: 배송전·배송중 주문이 없으면 최근 주문을 몇 건 얹는다 (상태 뱃지 확인용)
  const recentPicks = [...goods].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
  recentPicks.forEach((g, i) => {
    pushOrder([{ goods: g, seed: hashOf(g.id) + 11 }], i % 2 === 0 ? 1 : 4);
  });

  //── 요약
  const reviewsByGoods = reviews.reduce((acc, r) => ((acc[r.goods_id] = (acc[r.goods_id] ?? 0) + 1), acc), {});
  //갓 등록된 신상품은 구매확정까지 시간이 안 됐으니 리뷰가 없는 게 정상이다
  const ageOf = (g) => (NOW.getTime() - new Date(g.created_at).getTime()) / DAY;
  const noReview = goods.filter((g) => !reviewsByGoods[g.id] && ageOf(g) >= REVIEWABLE_AFTER_DAYS);
  const brandNewNoReview = goods.filter((g) => !reviewsByGoods[g.id] && ageOf(g) < REVIEWABLE_AFTER_DAYS);
  const statusTally = payments.reduce((acc, p) => ((acc[p.delivery_status] = (acc[p.delivery_status] ?? 0) + 1), acc), {});
  const ratingTally = reviews.reduce((acc, r) => ((acc[r.rating] = (acc[r.rating] ?? 0) + 1), acc), {});
  const uniqueContent = new Set(reviews.map((r) => r.content)).size;

  console.log(`기존 — 결제 ${oldPayments.length} · 주문상품 ${oldItems.length} · 리뷰 ${oldReviews.length}`);
  console.log(`신규 — 결제 ${payments.length} · 주문상품 ${orderItems.length} · 리뷰 ${reviews.length}`);
  console.log(`\n배송 상태:`, statusTally);
  console.log(`평점 분포:`, ratingTally);
  console.log(
    `평균 평점: ${(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)} · 고유 문장 ${uniqueContent}/${reviews.length}`
  );
  console.log(`주문자: ${new Set(payments.map((p) => p.user_id)).size}명 / 후보 ${buyers.length}명`);
  console.log(
    `리뷰 0건 (신상 · 정상): ${brandNewNoReview.length}${brandNewNoReview.length ? " — " + brandNewNoReview.map((g) => g.title.trim()).join(", ") : ""}`
  );

  if (noReview.length) {
    console.error(`\n[중단] 등록 14일이 지났는데 리뷰가 없는 상품 ${noReview.length}건: ${noReview.map((g) => g.title.trim()).join(", ")}`);
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("\n[dry-run] 삭제·생성 없이 종료합니다");
    return;
  }

  //── 백업
  const stamp = NOW.toISOString().slice(0, 19).replace(/[:T]/g, "");
  const backupDir = resolve(process.cwd(), "scripts/backup");
  mkdirSync(backupDir, { recursive: true });
  const backupPath = resolve(backupDir, `orders-${stamp}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify({ savedAt: NOW.toISOString(), payments: oldPayments, order_items: oldItems, goods_reviews: oldReviews }, null, 2)
  );
  console.log(`\n백업 — ${backupPath}`);

  //── payments.shipping_fee 컬럼이 아직 없으면 해당 필드는 빼고 넣는다
  let hasShippingFee = true;
  try {
    await rest("payments?select=shipping_fee&limit=1");
  } catch {
    hasShippingFee = false;
    console.warn("[안내] payments.shipping_fee 컬럼이 없어 배송비는 amount에만 반영됩니다 (supabase/shipping.sql 실행 필요)");
  }

  //── 삭제 (리뷰 → 주문상품 → 결제 순서로 참조를 풀어가며)
  await rest("goods_reviews?id=not.is.null", { method: "DELETE" });
  await rest("order_items?id=not.is.null", { method: "DELETE" });
  await rest("payments?id=not.is.null", { method: "DELETE" });
  console.log("기존 주문·결제·리뷰 삭제 완료");

  //── 생성
  const insertAll = async (table, rows, size = 50) => {
    for (let i = 0; i < rows.length; i += size) {
      await rest(table, { method: "POST", body: JSON.stringify(rows.slice(i, i + size)) });
    }
  };

  await insertAll(
    "payments",
    payments.map(({ shippingFee, ...row }) => (hasShippingFee ? { ...row, shipping_fee: shippingFee } : row))
  );
  await insertAll("order_items", orderItems);
  await insertAll("goods_reviews", reviews);

  console.log(`결제 ${payments.length} · 주문상품 ${orderItems.length} · 리뷰 ${reviews.length}건 생성 완료`);
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
