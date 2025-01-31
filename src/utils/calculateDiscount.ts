import { DiscountedPrice, PriceKeys } from "@/types";

//10원 단위 내림 처리
const roundToNearestTen = (price: number) => {
  return Math.floor(price / 10) * 10;
};

//할인율 계산
export const calculateDiscount = (
  price: number,
  discountRate: number | null
) => {
  const discountedPrice =
    discountRate !== null ? price - price * (discountRate / 100) : price;
  return roundToNearestTen(discountedPrice);
};

//가격 포맷팅
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

// 할인가격 계산
export const getDiscountedPrice = (
  item: DiscountedPrice,
  priceKey: PriceKeys = "price",
  discountKey: PriceKeys = "discount_rate"
) => {
  const price = item[priceKey] as number;
  const discountRate = item[discountKey] ?? 0;
  return calculateDiscount(price, discountRate);
};
