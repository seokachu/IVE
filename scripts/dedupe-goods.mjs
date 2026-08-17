/**
 * 굿즈샵 중복 상품 정리 — 같은 앨범이 시드 데이터와 크롤링 데이터로 두 벌씩 등록된 것을 하나로 합친다.
 *
 * 남기는 쪽은 큐레이션된 이미지가 더 많고 옵션 정보가 채워진 시드 상품이며,
 * 크롤링본에만 있던 제네릭 설명("스타쉽스퀘어 공식 굿즈입니다.") 대신 앨범별 설명을 새로 넣는다.
 * 제목에 섞여 있던 개행 문자도 함께 제거한다.
 *
 * 삭제 대상은 실행 전에 참조(리뷰·주문·장바구니·찜)를 다시 세어 0건인지 확인하고,
 * 하나라도 걸려 있으면 중단한다. 삭제 전 상품 전체를 scripts/backup/ 에 저장한다.
 *
 * 실행: pnpm goods:dedupe
 *       pnpm goods:dedupe --dry-run
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");

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

//keep: 남길 상품 / drop: 삭제할 중복 / title·description: 남길 쪽에 덮어쓸 값
const MERGES = [
  {
    label: "I'VE MINE (1st EP)",
    keep: "550e8400-e29b-41d4-a716-446655440024",
    drop: ["63925e79-4103-418c-a11c-48ad802ca538"],
    title: "IVE THE 1st EP I'VE MINE",
    description: [
      "PHOTO BOOK : 148 x 210mm / 80p / 3 Ver. 1EA",
      "포토카드 3종 중 랜덤 1종 · CD-R 1EA",
      "3가지 버전 중 랜덤 발송",
    ],
  },
  {
    label: "IVE SWITCH (2nd EP)",
    keep: "550e8400-e29b-41d4-a716-446655440034",
    drop: ["8e32808e-d192-41f4-8fdb-98db66c9cd4b"],
    title: "IVE THE 2nd EP IVE SWITCH",
    description: [
      "PHOTO BOOK : 148 x 210mm / 84p / 2 Ver. 1EA",
      "포토카드 6종 중 랜덤 2종 · 폴딩 포스터 1EA",
      "2가지 버전 중 랜덤 발송",
    ],
  },
  {
    label: "IVE EMPATHY (3rd EP)",
    keep: "04a75947-9b70-43ad-9011-7f01161dfe38",
    drop: ["f083ff78-a332-4e82-8355-670fc2dc19ad"],
    title: "IVE THE 3rd EP IVE EMPATHY",
    description: [
      "TITLE : REBEL HEART",
      "PHOTO BOOK : 148 x 210mm / 88p / 3 Ver. 1EA",
      "포토카드 랜덤 2종 · 엽서 1EA",
    ],
  },
  {
    //"IVE THE 4th EP IVE SECRET"는 미니 4집 일반반과 같은 상품 — 색상랜덤반/MD 한정반 두 에디션만 남긴다
    label: "IVE SECRET (4th EP / 미니 4집)",
    keep: "dd5abea0-ea23-4ea6-a0fe-3f352edc4a04",
    drop: ["c09bf492-e765-4014-80a5-f79338971fe6"],
    title: "[IVE SECRET] IVE 미니 4집 (색상랜덤발송)",
    description: [
      "출고 : 2025.09.02 순차 발송",
      "SIZE : 180mm x 240mm / 1EA",
      "핑크 · 블루 · 그린 3종 중 색상 랜덤 발송",
    ],
  },
];

//중복과 무관하게 제목에 개행이 섞여 있던 상품
const TITLE_FIXES = [["550e8400-e29b-41d4-a716-446655440003", "IVE OFFICIAL LIGHT STICK"]];

const main = async () => {
  const goods = await rest("goods?select=*&limit=300");
  const byId = new Map(goods.map((item) => [item.id, item]));

  const [reviews, orderItems, carts, wishes] = await Promise.all([
    rest("goods_reviews?select=id,goods_id&limit=500"),
    rest("order_items?select=id,product_id&limit=1000"),
    rest("cart?select=id,product_id&limit=500"),
    rest("wish_lists?select=id,product_id&limit=500"),
  ]);

  const refsOf = (id) => ({
    리뷰: reviews.filter((r) => r.goods_id === id).length,
    주문항목: orderItems.filter((o) => o.product_id === id).length,
    장바구니: carts.filter((c) => c.product_id === id).length,
    찜: wishes.filter((w) => w.product_id === id).length,
  });

  const dropIds = [];
  let blocked = false;

  for (const merge of MERGES) {
    console.log(`\n===== ${merge.label} =====`);

    if (!byId.has(merge.keep)) {
      console.error(`  [오류] 남길 상품이 DB에 없습니다: ${merge.keep}`);
      blocked = true;
      continue;
    }
    console.log(`  남김  ${byId.get(merge.keep).title.replace(/\n/g, "\\n")}`);
    console.log(`        → 제목 "${merge.title}" · 설명 ${merge.description.length}줄로 갱신`);

    for (const id of merge.drop) {
      if (!byId.has(id)) {
        console.log(`  건너뜀 ${id} (이미 없음)`);
        continue;
      }
      const refs = refsOf(id);
      const total = Object.values(refs).reduce((sum, n) => sum + n, 0);
      const detail = Object.entries(refs)
        .map(([key, n]) => `${key} ${n}`)
        .join(" · ");

      if (total > 0) {
        //참조가 남아 있으면 지우지 않는다 — 주문 내역이 끊기는 편이 중복보다 나쁘다
        console.error(`  [중단] ${byId.get(id).title} — 참조 ${detail}`);
        blocked = true;
        continue;
      }
      console.log(`  삭제  ${byId.get(id).title} (${detail})`);
      dropIds.push(id);
    }
  }

  if (blocked) {
    console.error("\n참조가 남아 있는 상품이 있어 중단합니다. 위 항목을 먼저 정리하세요.");
    process.exit(1);
  }

  console.log("\n=== 제목 개행 제거 ===");
  for (const [id, title] of TITLE_FIXES) {
    if (byId.has(id)) console.log(`  ${JSON.stringify(byId.get(id).title)} → ${JSON.stringify(title)}`);
  }

  if (DRY_RUN) {
    console.log(`\n[dry-run] 삭제 ${dropIds.length}건 · 갱신 ${MERGES.length + TITLE_FIXES.length}건 예정`);
    return;
  }

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "");
  const backupDir = resolve(process.cwd(), "scripts/backup");
  mkdirSync(backupDir, { recursive: true });
  const backupPath = resolve(backupDir, `goods-dedupe-${stamp}.json`);
  writeFileSync(backupPath, JSON.stringify({ savedAt: new Date().toISOString(), goods }, null, 2));
  console.log(`\n백업 — ${backupPath}`);

  for (const merge of MERGES) {
    await rest(`goods?id=eq.${merge.keep}`, {
      method: "PATCH",
      body: JSON.stringify({ title: merge.title, description: merge.description }),
    });
  }
  for (const [id, title] of TITLE_FIXES) {
    if (byId.has(id)) await rest(`goods?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ title }) });
  }
  for (const id of dropIds) {
    await rest(`goods?id=eq.${id}`, { method: "DELETE" });
  }

  console.log(`\n중복 ${dropIds.length}건 삭제 · 대표 상품 ${MERGES.length}건 정보 갱신 완료`);
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
