-- 배송비 정책 도입 (Supabase SQL Editor에서 실행)
-- 기존에는 배송비가 화면에 "무료"로 하드코딩만 되어 있어 실제로 계산·보관되지 않았다.
-- 조건부 무료배송(기본 3,000원 / 상품금액 30,000원 이상 무료)을 도입하면서
-- 주문 시점의 배송비를 결제 레코드에 함께 남긴다.
--
-- payments.amount 는 배송비까지 포함한 최종 결제 금액이고,
-- shipping_fee 는 그중 배송비가 얼마였는지를 분리해 보관한다.
-- (멤버십 티어·상품 구성은 나중에 바뀔 수 있어 사후 재계산으로는 복원할 수 없다)

alter table public.payments
  add column if not exists shipping_fee integer not null default 0;

comment on column public.payments.shipping_fee is
  '주문 시점에 부과된 배송비(원). amount에 이미 포함되어 있으며, 무료배송이면 0';

-- 이 컬럼이 없던 시절의 주문은 전부 무료배송으로 처리됐으므로 기본값 0이 그대로 맞다.
