-- 하이브리드 앱 푸시 토큰 저장 테이블
-- Supabase 대시보드 > SQL Editor에서 실행
create table if not exists public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text,
  updated_at timestamptz not null default now()
);

alter table public.push_tokens enable row level security;

-- 본인 토큰만 등록/수정/삭제 가능. 다른 사용자 토큰 조회는 서버(service role)에서만.
create policy "Users manage own push tokens"
  on public.push_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
