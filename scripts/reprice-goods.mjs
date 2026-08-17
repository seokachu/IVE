/**
 * 굿즈샵 상품 메타(할인율·등록일·배송정책·출고안내)를 scripts/data/goods-catalog.mjs 기준으로 갱신한다.
 *
 * - goods 행을 지우지 않고 4개 컬럼만 PATCH 한다 (주문·리뷰·장바구니 연결 보존)
 * - 갱신 전 현재 값을 scripts/backup/ 에 JSON 으로 저장한다
 * - 카탈로그에 없는 상품 / DB에 없는 카탈로그 항목은 경고만 내고 건너뛴다
 *
 * 실행: pnpm goods:reprice
 *       pnpm goods:reprice --dry-run
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";
import { GOODS_META, SHIP, DELIVERY } from "./data/goods-catalog.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");

//src/utils/constants 의 값과 맞춰야 한다 (NEW 판정 기간 · 무료배송 기준 금액)
const GOODS_NEW_DAYS = 30;
const FREE_SHIPPING_MIN_PRICE = 40000;

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

const NOW = new Date();

//"same" | "std" | "YYYY.MM.DD"
const resolveDelivery = (value) => {
  if (value === "same") return DELIVERY.SAME_DAY;
  if (value === "std") return DELIVERY.STANDARD;
  //예약출고는 미래 날짜만 유효 — 이미 지났으면 일반 출고로 되돌린다
  const shipDate = new Date(value.replace(/\./g, "-"));
  return shipDate > NOW ? DELIVERY.reserved(value) : DELIVERY.STANDARD;
};

const main = async () => {
  const goods = await rest("goods?select=id,title,price,discount_rate,shipping_type,delivery_info,created_at&limit=300");
  const byId = new Map(goods.map((item) => [item.id, item]));

  const catalogIds = new Set(GOODS_META.map(([id]) => id));
  const missingInDb = GOODS_META.filter(([id]) => !byId.has(id));
  const missingInCatalog = goods.filter((item) => !catalogIds.has(item.id));

  if (missingInDb.length) {
    console.warn(`[경고] DB에 없는 카탈로그 항목 ${missingInDb.length}건 — 건너뜁니다`);
    missingInDb.forEach(([id, , , , , memo]) => console.warn(`  · ${id} (${memo})`));
  }
  if (missingInCatalog.length) {
    console.warn(`[경고] 카탈로그에 없는 상품 ${missingInCatalog.length}건 — 기존 값을 유지합니다`);
    missingInCatalog.forEach((item) => console.warn(`  · ${item.id} ${item.title}`));
  }

  const updates = GOODS_META.filter(([id]) => byId.has(id)).map(([id, date, discount, ship, delivery, memo]) => {
    const current = byId.get(id);
    const shippingType = ship === "F" ? SHIP.FREE : SHIP.NORMAL;

    //무료배송 특전은 "음반 전 품목 + 정가 40,000원 이상"이 기준 — 카탈로그가 어긋나면 잡아낸다
    const looksExpensive = current.price >= FREE_SHIPPING_MIN_PRICE;
    if (ship === "N" && looksExpensive && !/음반|정가/.test(memo)) {
      console.warn(`[검토] ${current.title} — ${current.price}원인데 일반배송으로 지정됨`);
    }

    return {
      id,
      title: current.title,
      price: current.price,
      memo,
      before: {
        discount_rate: current.discount_rate,
        shipping_type: current.shipping_type,
        delivery_info: current.delivery_info,
        created_at: current.created_at,
      },
      after: {
        discount_rate: discount,
        shipping_type: shippingType,
        delivery_info: resolveDelivery(delivery),
        //자정 대신 오전 10시로 — 발매일 표기가 시간대에 따라 하루 밀리지 않게
        created_at: new Date(`${date}T10:00:00+09:00`).toISOString(),
      },
    };
  });

  //── 요약 통계
  const tally = (rows, key) =>
    rows.reduce((acc, row) => {
      const value = row.after[key];
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, {});

  const newCount = updates.filter(
    (row) => NOW - new Date(row.after.created_at) <= GOODS_NEW_DAYS * 24 * 60 * 60 * 1000
  );

  console.log(`대상 상품 ${updates.length} / 전체 ${goods.length}`);
  console.log("\n할인율 분포:", tally(updates, "discount_rate"));
  console.log("배송 정책:", tally(updates, "shipping_type"));
  console.log("출고 안내:", tally(updates, "delivery_info"));
  console.log(`\nNEW 뱃지 대상 (최근 ${GOODS_NEW_DAYS}일): ${newCount.length}건`);
  newCount.forEach((row) => console.log(`  · ${row.after.created_at.slice(0, 10)} ${row.title}`));

  const priced = updates.filter((row) => row.after.discount_rate === 0).length;
  console.log(`\n정가 유지: ${priced}건 (${Math.round((priced / updates.length) * 100)}%)`);

  //── 백업
  const stamp = NOW.toISOString().slice(0, 19).replace(/[:T]/g, "");
  if (!DRY_RUN) {
    const backupDir = resolve(process.cwd(), "scripts/backup");
    mkdirSync(backupDir, { recursive: true });
    const backupPath = resolve(backupDir, `goods-${stamp}.json`);
    writeFileSync(backupPath, JSON.stringify({ savedAt: NOW.toISOString(), goods }, null, 2));
    console.log(`\n백업 — ${backupPath}`);
  } else {
    console.log("\n[dry-run] 백업·갱신 없이 종료합니다");
    return;
  }

  //── 갱신
  let changed = 0;
  for (const row of updates) {
    const diff = Object.keys(row.after).filter((key) => row.before[key] !== row.after[key]);
    if (diff.length === 0) continue;
    await rest(`goods?id=eq.${row.id}`, { method: "PATCH", body: JSON.stringify(row.after) });
    changed++;
  }
  console.log(`\n상품 ${changed}건 갱신 완료`);
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
