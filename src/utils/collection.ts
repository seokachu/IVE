//배열을 특정 키 기준으로 그룹화
export const groupBy = <T, K extends keyof T>(items: T[], key: K): Record<string, T[]> => {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});
};

//배열 항목의 숫자 값을 합산 — 키 이름이나 계산 함수를 받는다
export const sumBy = <T>(items: T[], iteratee: keyof T | ((item: T) => number)): number => {
  return items.reduce((total, item) => {
    const value = typeof iteratee === "function" ? iteratee(item) : Number(item[iteratee] ?? 0);
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
};
