"use client";
import { useRecoilState } from "recoil";
import { cartState, selectedItemState } from "@/store";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { useEffect, useState } from "react";
import CartSummarySkeleton from "../common/loading/CartSummarySkeleton";
import PaymentButton from "../payment/PaymentButton";
import ActionButton from "../common/button/ActionButton";

const CartSummary = () => {
  const [cartItems] = useRecoilState(cartState);
  const [selectedItems] = useRecoilState(selectedItemState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //선택된 아이템을 필터링
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  //총 상품 금액
  const totalOriginalPrice = selectedCartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  //할인된 총 금액
  const totalDiscountedPrice = selectedCartItems.reduce((sum, item) => {
    const discountedPrice = getDiscountedPrice(item);
    return sum + discountedPrice * item.quantity;
  }, 0);

  //총 할인 금액
  const totalDiscountAmount = totalOriginalPrice - totalDiscountedPrice;

  return mounted ? (
    <div className="lg:sticky lg:top-5 flex-1 border rounded-md bg-white shadow-sm p-10 h-fit">
      <div className="mb-12">
        <h2 className="font-bold text-xl mb-5">결제 금액</h2>
        <div className="border-b pb-3 flex justify-between items-center">
          <p>총 결제 금액</p>
          <p>
            <strong className="text-xl mr-1 text-purple">
              {formatPrice(totalDiscountedPrice)}
            </strong>
            원
          </p>
        </div>
        <div className="pt-5">
          <p className="mb-1 flex justify-between items-center">
            상품 금액
            <span>{formatPrice(totalOriginalPrice)}원</span>
          </p>
          <p className="flex justify-between items-center">
            총 할인 금액
            <span className="text-dark-orange">
              -{formatPrice(totalDiscountAmount)}원
            </span>
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between border-b pb-4 mb-5">
          <h2 className="font-bold">주문자 정보</h2>
          <ActionButton variant="primary" className="text-xs px-2">
            정보 변경
          </ActionButton>
        </div>
        <ul className="flex flex-col justify-between gap-2 text-sm">
          <li className="flex">
            <h3 className="w-[100px] text-gray-400">받는 분</h3>
            <p>홍길동</p>
          </li>
          <li className="flex">
            <h3 className="w-[100px] text-gray-400">휴대폰 번호</h3>
            <p>010-0000-0000</p>
          </li>
          <li className="flex">
            <h3 className="w-[100px] text-gray-400">이메일 주소</h3>
            <p>seokachuu@naver.com</p>
          </li>
        </ul>
      </div>

      <div className="mb-12">
        <div className="flex justify-between border-b pb-4 mb-5">
          <h2 className="font-bold">배송 정보</h2>
          <ActionButton variant="primary" className="text-xs px-2">
            배송지 변경
          </ActionButton>
        </div>
        <ul className="flex flex-col justify-between gap-2 text-sm">
          <li className="flex">
            <h3 className="w-[100px] text-gray-400">받는 분</h3>
            <p>홍길동</p>
          </li>
          <li className="flex">
            <h3 className="w-[100px] text-gray-400">휴대폰 번호</h3>
            <p>010-0000-0000</p>
          </li>
          <li className="flex">
            <h3 className="w-[100px] text-gray-400">배송지 정보</h3>
            <div>
              <p>도로명 : 경기 성남시 분당구 판교역로 111</p>
              <p>지번 : 경기 성남시 분당구 판교역로 111</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold border-b pb-4 mb-5">주문동의</h2>
        <div className="text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            [필수] 주문 내역에 대한 필수 동의
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            [필수] 개인정보 수집 및 이용 및 제 3자 제공 동의
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            [필수] 결제 이후 환불 및 취소 불가 동의
          </label>
        </div>
        <h3 className="text-gray-400 text-sm text-center my-3">
          본인은 만 14세 이상이며 주문내용을 확인하였습니다.
        </h3>
      </div>

      <PaymentButton
        amount={totalDiscountedPrice}
        orderName={`${selectedCartItems[0]?.title} 외 ${
          selectedCartItems.length - 1
        }건`}
      />
    </div>
  ) : (
    <CartSummarySkeleton />
  );
};

export default CartSummary;
