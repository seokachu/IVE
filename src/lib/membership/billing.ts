//토스페이먼츠 빌링(정기결제) 서버 헬퍼 — API 라우트 전용 (클라이언트에서 import 금지)
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const TOSS_BILLING_ISSUE_URL = "https://api.tosspayments.com/v1/billing/authorizations/issue";
const TOSS_BILLING_CHARGE_URL = "https://api.tosspayments.com/v1/billing";

export const MEMBERSHIP_PRICES: Record<string, { price: number; orderName: string }> = {
  plus: { price: 1900, orderName: "DIVE+ 멤버십 월 구독" },
  vip: { price: 5900, orderName: "DIVE VIP 멤버십 월 구독" },
};

const tossAuthHeader = () => ({
  Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
  "Content-Type": "application/json",
});

//쿠키 세션으로 로그인 유저 확인
export const getAuthUser = async () => {
  const cookieStore = await cookies();
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );
  const {
    data: { user },
  } = await authClient.auth.getUser();
  return user;
};

//서비스롤 클라이언트 (memberships 테이블은 RLS로 쓰기가 막혀 있어 서버에서만 조작)
export const getAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false },
  });
};

//authKey → 빌링키 발급
export const issueBillingKey = async (authKey: string, customerKey: string) => {
  const res = await fetch(TOSS_BILLING_ISSUE_URL, {
    method: "POST",
    headers: tossAuthHeader(),
    body: JSON.stringify({ authKey, customerKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "빌링키 발급에 실패했습니다.");

  return {
    billingKey: data.billingKey as string,
    cardCompany: (data.cardCompany ?? data.card?.company ?? null) as string | null,
    cardNumber: (data.cardNumber ?? data.card?.number ?? null) as string | null,
  };
};

//빌링키로 결제 승인
export const chargeBilling = async (input: {
  billingKey: string;
  customerKey: string;
  amount: number;
  orderName: string;
}) => {
  const orderId = `DIVE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(`${TOSS_BILLING_CHARGE_URL}/${input.billingKey}`, {
    method: "POST",
    headers: tossAuthHeader(),
    body: JSON.stringify({
      customerKey: input.customerKey,
      amount: input.amount,
      orderId,
      orderName: input.orderName,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "정기결제 승인에 실패했습니다.");
  return data;
};

//다음 결제일 — 한 달 뒤 같은 날 (말일 넘어가면 자동 보정됨)
export const getNextBillingDate = (from: Date = new Date()) => {
  const next = new Date(from);
  next.setMonth(next.getMonth() + 1);
  return next;
};
