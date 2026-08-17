-- 회원탈퇴 준비 SQL
-- Supabase 대시보드 > SQL Editor에서 실행
--
-- 탈퇴 정책: auth.users(로그인 계정)만 삭제하고 public.user(프로필 행)는 남긴다.
-- 글·댓글이 public.user를 참조하므로, 프로필 행을 "탈퇴한 회원"으로 익명화해 두면
-- 작성한 게시글/댓글이 그대로 보존된다. (서버 라우트 /api/account가 익명화를 수행)
--
-- 이를 위해 public.user → auth.users FK를 제거한다.
-- FK가 on delete cascade면 계정 삭제 시 프로필과 글이 연쇄 삭제되고,
-- no action이면 계정 삭제 자체가 실패하므로, 어느 쪽이든 FK가 없어야 한다.
-- (신규 가입 시 프로필 생성은 기존 트리거가 그대로 담당하므로 영향 없음)

do $$
declare
  fk record;
begin
  for fk in
    select conname
    from pg_constraint
    where conrelid = 'public.user'::regclass
      and confrelid = 'auth.users'::regclass
      and contype = 'f'
  loop
    execute format('alter table public.user drop constraint %I', fk.conname);
    raise notice 'dropped constraint: %', fk.conname;
  end loop;
end $$;

-- (참고) auth.users를 참조하는 나머지 FK 확인용 쿼리 —
-- cascade가 아닌 FK가 남아 있으면 계정 삭제가 실패할 수 있다.
-- select conrelid::regclass as table_name, conname, confdeltype
-- from pg_constraint
-- where confrelid = 'auth.users'::regclass and contype = 'f';
