import { readFileSync } from "node:fs";
import { resolve } from "node:path";

//.env.local을 파싱해 process.env에 주입 (스크립트 전용 — dotenv 의존성 없이 사용)
//CI처럼 파일이 없는 환경에서는 건너뛰고 process.env(시크릿)를 그대로 사용한다
export const loadEnv = (file = ".env.local") => {
  let raw;
  try {
    raw = readFileSync(resolve(process.cwd(), file), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=["']?(.*?)["']?$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
};

export const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`[오류] 환경변수 ${name}가 없습니다. .env.local을 확인하세요.`);
    process.exit(1);
  }
  return value;
};
