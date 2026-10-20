import { createClient, type SupabaseClient } from "@supabase/supabase-js";

//사이트 상태 KV(site_state, supabase/site-state.sql) — 외부 수집(유튜브 RSS 등)이 실패한 사이
//화면이 비지 않도록 마지막 성공 값을 기억해 두는 용도. 쓰기는 서비스롤에서만 한다.

const SITE_STATE_TABLE = "site_state";
//Supabase가 늦어도 페이지 생성을 붙들지 않도록 짧게 끊는다
const STATE_TIMEOUT_MS = 3000;

//서비스롤이 있으면 읽기·쓰기, 없으면(로컬 등) 공개 읽기 정책으로 읽기만
let stateClient: { client: SupabaseClient; canWrite: boolean } | null | undefined;

const getStateClient = () => {
  if (stateClient !== undefined) return stateClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  stateClient =
    url && key
      ? { client: createClient(url, key, { auth: { persistSession: false } }), canWrite: !!serviceRoleKey }
      : null;
  return stateClient;
};

//재생성 주기(30분)마다 한 번이라 값 비교 없이 upsert
export const writeSiteState = async (key: string, value: unknown) => {
  const state = getStateClient();
  if (!state?.canWrite) return;

  try {
    const { error } = await state.client
      .from(SITE_STATE_TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      .abortSignal(AbortSignal.timeout(STATE_TIMEOUT_MS));
    if (error) console.error(`[site_state] ${key} 저장 실패`, error);
  } catch (error) {
    console.error(`[site_state] ${key} 저장 실패`, error);
  }
};

export const readSiteState = async <T>(key: string): Promise<T | null> => {
  const state = getStateClient();
  if (!state) return null;

  try {
    const { data, error } = await state.client
      .from(SITE_STATE_TABLE)
      .select("value")
      .eq("key", key)
      .abortSignal(AbortSignal.timeout(STATE_TIMEOUT_MS))
      .maybeSingle();
    if (error) {
      console.error(`[site_state] ${key} 조회 실패`, error);
      return null;
    }
    return (data?.value as T | undefined) ?? null;
  } catch (error) {
    console.error(`[site_state] ${key} 조회 실패`, error);
    return null;
  }
};
