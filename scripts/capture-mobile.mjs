//모바일 시안용 풀페이지 캡처 — design/assets/mobile/<이름>-3.png (390px, 2x). 로컬 dev 서버(3000)가 떠 있어야 한다.
//하단 탭바·GoTop은 숨긴다(.pen에서 BottomNav 컴포넌트를 얹으므로). 너무 긴 페이지는 렌더러 텍스처 한계(16384px) 아래로 배율을 낮춘다.
//실행: pnpm capture:mobile  (MANIFEST=경로 로 결과 json 저장, ONLY=이름,이름 으로 일부만)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

//playwright는 직접 의존성이 아니라(스토리북이 끌고 옴) pnpm 가상 스토어에서 찾는다 — 브라우저 바이너리는 ~/Library/Caches/ms-playwright
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const resolvePlaywright = () => {
  for (const dir of [ROOT, path.join(ROOT, "node_modules/.pnpm/node_modules")]) {
    for (const name of ["playwright", "playwright-core"]) {
      try {
        return createRequire(path.join(dir, "/")).resolve(name);
      } catch {}
    }
  }
  throw new Error("playwright를 찾지 못했다 — pnpm add -D playwright");
};
const playwright = await import(resolvePlaywright());
const { chromium } = playwright.default ?? playwright;

const OUT = "/Users/seoyoungpark/Desktop/Front-End/ive/design/assets/mobile";
const BASE = "http://localhost:3000";
const MAX_PX = 16000;
//히어로 유튜브 iframe은 로드 타이밍에 따라 제목·컨트롤 오버레이가 찍혀서 숨기고 썸네일 폴백으로 찍는다
//(title 속성은 IFrame API가 영상 제목으로 덮어써서 src로 잡는다). nextjs-portal은 dev 도구 배지
const HIDE_CSS = `nav[aria-label="하단 메뉴"],button[aria-label="최상단으로 이동"],iframe[src*="youtube.com/embed/"],nextjs-portal{display:none!important}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "ko-KR",
  colorScheme: "light",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
const manifest = [];
//ONLY=mobile-cart,mobile-board 처럼 일부만 다시 찍을 때
const only = process.env.ONLY?.split(",").map((v) => v.trim()).filter(Boolean);

const idle = () => page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});

async function settle() {
  await idle();
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await idle();
}

async function capture(name, url, prep) {
  if (only && !only.includes(name)) return;
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.addStyleTag({ content: HIDE_CSS });
  if (prep) await prep();
  await page.addStyleTag({ content: HIDE_CSS });
  await settle();
  const cssH = await page.evaluate(() => document.documentElement.scrollHeight);
  let scale = 2;
  if (cssH * 2 > MAX_PX) {
    scale = Math.floor((MAX_PX / cssH) * 100) / 100;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: scale, mobile: true });
    await page.waitForTimeout(500);
  }
  const file = `${OUT}/${name}-3.png`;
  await page.screenshot({ path: file, fullPage: true });
  if (scale !== 2) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  }
  manifest.push({ name, url: page.url().replace(BASE, ""), file: `assets/mobile/${name}-3.png`, scale, cssH });
  console.log("captured", name, page.url().replace(BASE, ""), "cssH", cssH, "scale", scale);
}

await capture("mobile-main", "/");
await capture("mobile-news", "/news");
await capture("mobile-discography", "/discography");
await capture("mobile-shop", "/shop");

await page.goto(BASE + "/shop", { waitUntil: "domcontentloaded" });
await idle();
//굿즈 카드는 <a>가 아니라 click→push라 data-detail-path를 읽는다 (ShopListItem)
const productHref = await page.evaluate(() => document.querySelector("[data-detail-path]")?.getAttribute("data-detail-path"));
if (!productHref) throw new Error("상품 링크를 못 찾음");
await capture("mobile-shop-detail", productHref, async () => {
  await idle();
  const btn = page.getByRole("button", { name: "장바구니 담기" }).first();
  if (await btn.count()) {
    await btn.click().catch((e) => console.log("cart click fail", e.message));
    await page.waitForTimeout(800);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);
  } else console.log("no cart button");
});

await capture("mobile-board", "/board");
await page.goto(BASE + "/board", { waitUntil: "domcontentloaded" });
await idle();
const boardHref = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="/board/"]')].map((a) => a.getAttribute("href")).find((h) => /^\/board\/[^/?#]+$/.test(h) && !/write/.test(h))
);
if (!boardHref) throw new Error("게시글 링크를 못 찾음");
await capture("mobile-board-detail", boardHref);
await capture("mobile-cart", "/cart");

if (process.env.MANIFEST) fs.writeFileSync(process.env.MANIFEST, JSON.stringify(manifest, null, 2));
console.table(manifest);
await browser.close();
