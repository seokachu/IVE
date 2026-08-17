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
  -- 다운그레이드 예약 — 다음 결제일에 크론이 이 티어로 교체한다 (null이면 예약 없음)
  pending_tier text check (pending_tier in ('plus', 'vip')),
  started_at timestamptz not null default now(),
  next_billing_at timestamptz not null,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- 기존에 테이블을 만들어 둔 환경용 (신규 생성 시에는 위 컬럼 정의로 이미 존재)
alter table public.memberships add column if not exists pending_tier text;
alter table public.memberships drop constraint if exists memberships_pending_tier_check;
alter table public.memberships add constraint memberships_pending_tier_check
  check (pending_tier in ('plus', 'vip'));

-- billing_key가 노출되면 안 되므로 테이블 자체는 서비스롤 전용, 읽기는 아래 뷰로만
alter table public.memberships enable row level security;

-- 본인 행 조회 허용 (카드 정보 포함 — 결제 수단 변경 모달에서 사용)
create policy "memberships_own_read" on public.memberships
  for select using (auth.uid() = user_id);

-- 컬럼 단위 방어선: 클라이언트 역할은 빌링키·고객키 컬럼을 아예 못 읽음 (서버는 서비스롤이라 무관)
revoke select on public.memberships from anon, authenticated;
grant select (id, user_id, tier, status, price, card_company, card_number, pending_tier, started_at, next_billing_at, canceled_at, created_at)
  on public.memberships to authenticated;

-- 커뮤니티 뱃지용 공개 뷰 — 민감 컬럼 제외, 혜택 유지 중인 구독만 노출
-- (security definer 뷰라 RLS를 우회하므로 노출 컬럼을 꼭 최소로 유지할 것)
create or replace view public.memberships_public as
select user_id, tier
from public.memberships
where status = 'active'
   or (status = 'canceled' and next_billing_at > now());

grant select on public.memberships_public to anon, authenticated;
