-- DIVE 멤버십 구독 테이블 (Supabase SQL Editor에서 실행)
-- 토스페이먼츠 빌링키 기반 월 정기결제 — 유저당 1행 (tier: plus=DIVE+ 1,900원 / vip=DIVE VIP 5,900원)
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tier text not null check (tier in ('plus', 'vip')),
  -- active: 구독 중 / canceled: 해지됨 (next_billing_at까지 혜택 유지)
  status text not null default 'active' check (status in ('active', 'canceled')),
  price integer not null,
  billing_key text not null,
  customer_key text not null,
  card_company text,
  card_number text, -- 마스킹된 카드번호 (예: **** **** **** 1234)
  started_at timestamptz not null default now(),
  next_billing_at timestamptz not null,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- billing_key가 노출되면 안 되므로 테이블 자체는 서비스롤 전용, 읽기는 아래 뷰로만
alter table public.memberships enable row level security;

-- 본인 행 조회 허용 (카드 정보 포함 — 결제 수단 변경 모달에서 사용)
create policy "memberships_own_read" on public.memberships
  for select using (auth.uid() = user_id);

-- 커뮤니티 뱃지용 공개 뷰 — 민감 컬럼 제외, 혜택 유지 중인 구독만 노출
-- (security definer 뷰라 RLS를 우회하므로 노출 컬럼을 꼭 최소로 유지할 것)
create or replace view public.memberships_public as
select user_id, tier
from public.memberships
where status = 'active'
   or (status = 'canceled' and next_billing_at > now());

grant select on public.memberships_public to anon, authenticated;
