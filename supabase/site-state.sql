-- 사이트 상태 KV 테이블 (Supabase SQL Editor에서 1회 실행)
-- 메인 히어로 "마지막 성공 영상"처럼 외부 수집이 실패한 사이 화면이 비지 않도록 기억해 둘 작은 값들을 보관한다.
create table if not exists public.site_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 누구나 읽기 가능, 쓰기는 서버(서비스롤)에서만
alter table public.site_state enable row level security;

create policy "site_state_public_read" on public.site_state
  for select using (true);
