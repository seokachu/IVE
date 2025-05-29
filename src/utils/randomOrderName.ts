import { customAlphabet } from "nanoid";

//랜덤 문자열 생성
const customNanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export const generateRandomOrderId = () => {
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const yyyymmdd = `${year}${month}${day}`;

  return `${yyyymmdd}-${customNanoid()}`;
};
