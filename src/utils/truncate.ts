interface TruncateOptions {
  length?: number;
  omission?: string;
}

//길이를 넘는 문자열을 잘라내고 말줄임 표시를 붙인다 — 결과 길이는 length를 넘지 않는다
export const truncate = (text: string | null | undefined, { length = 30, omission = "..." }: TruncateOptions = {}) => {
  const value = text ?? "";
  if (value.length <= length) return value;
  return value.slice(0, Math.max(0, length - omission.length)) + omission;
};
