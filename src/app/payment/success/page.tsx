"use client";
import ActionButton from "@/components/common/button/ActionButton";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/queries/usePayment";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import Error from "@/components/common/error/Error";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, sessionState } from "@/store";
import { getPaymentByOrderId, savePayment } from "@/lib/supabase/payment";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";
import { useQueryClient } from "@tanstack/react-query";
import { saveOrderItems } from "@/lib/supabase/orders";
import { formatPrice } from "@/utils/calculateDiscount";

const page = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = useRecoilValue(sessionState);
  const [cartItems] = useRecoilState(cartState);
  const orderId = searchParams.get("orderId") as string;
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName");

  const { data: address } = useShippingAddress(session?.user.id);
  const {
    data: payment,
    isLoading: paymentLoading,
    error: paymentError,
  } = usePayment(orderId);
  const {
    data: orderItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useOrderItems(orderId);

  console.log("orderItems", orderItems);

  useEffect(() => {
    if (!orderId || !paymentKey || !amount || !address || !session) return;

    const savePaymentData = async () => {
      try {
        // 먼저 기존 결제 데이터가 있는지 확인
        const existingPayment = await getPaymentByOrderId(orderId);

        // 이미 결제 데이터가 있다면 저장 프로세스 스킵
        if (existingPayment) {
          console.log("Payment data already exists:", existingPayment);
          return;
        }

        // 토스페이먼츠 결제 조회 API 호출
        const response = await fetch(
          `https://api.tosspayments.com/v1/payments/${paymentKey}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${process.env.NEXT_PUBLIC_TOSS_SECRET_KEY}:`
              ).toString("base64")}`,
            },
          }
        );

        const paymentInfo = await response.json();

        const paymentData = {
          user_id: session.user.id,
          order_id: orderId,
          amount: Number(amount),
          order_name: orderName,
          payment_method: "카드",
          status: "결제 완료",
          installment_months: paymentInfo.card?.installmentPlanMonths || 0,
          recipient_name: address.recipient_name,
          recipient_phone: address.recipient_phone,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          postal_code: address.postal_code,
          delivery_status: "배송전",
          created_at: new Date().toISOString(),
        };

        await savePayment(paymentData);

        const orderItemsData = cartItems.map((item: any) => ({
          user_id: session.user.id,
          order_id: orderId,
          product_id: item.id,
          product_name: item.title,
          product_image: item.thumbnail,
          price: item.price,
          quantity: item.quantity,
          shipping_type: item.shipping_type,
        }));
        await saveOrderItems(orderItemsData);

        // 데이터 저장 후 즉시 쿼리 무효화 및 리패치
        await queryClient.invalidateQueries({
          queryKey: ["payment", orderId],
        });
        await queryClient.refetchQueries({
          queryKey: ["payment", orderId],
        });
      } catch (error) {
        console.error("Detailed error in savePaymentData:", error);
      }
    };

    savePaymentData();
  }, [orderId, paymentKey, amount, address, session, queryClient]);

  // 모든 데이터 로딩 중일 때
  if (paymentLoading || itemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>결제 정보를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 발생 시
  if (paymentError || itemsError || !payment) {
    return (
      <main className="min-h-[60vh]">
        <Error />
      </main>
    );
  }
  console.log(payment);

  return (
    <main>
      <section className="px-5 pt-14 pb-28 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-[1320px] w-full m-auto flex flex-col gap-5 px-5">
          <div className="flex flex-col gap-4 items-center mb-10">
            <h2 className="font-bold text-xl">주문이 완료되었습니다.</h2>
            <h3 className="text-gray-500">
              주문상품 번호 : {payment.order_id}
            </h3>
            <div className="flex gap-3">
              <ActionButton
                variant="default"
                className="px-6 py-2 hover:bg-gray-50 hover:text-primary text-sm"
              >
                주문상세 보기
              </ActionButton>
              <ActionButton variant="primary" className="px-6 py-2 text-sm">
                쇼핑 계속하기
              </ActionButton>
            </div>
          </div>

          <div className="border rounded-lg p-6 mb-8">
            <h2 className="text-xl mb-8 border-b pb-4">
              <strong>
                <span>주문상품 정보</span>
                <span className="inline-block -translate-y-[2px] px-2">|</span>
                <span>총 {orderItems?.length}개</span>
              </strong>
            </h2>
            <ul className="flex flex-col w-full">
              {orderItems?.map((item: any) => (
                <li
                  key={item.id}
                  className="flex gap-4 items-center mb-5 p-4 rounded-lg bg-[#F5F5F5]"
                >
                  <Image
                    src={item.product_image || DefaultImage}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-md border"
                    width={500}
                    height={500}
                  />
                  <div className="flex flex-col gap-1">
                    <strong>{item.product_name}</strong>
                    <p className="text-sm">
                      <span>{formatPrice(item.price)}원</span>
                      <span className="px-1 inline-block -translate-y-[1px]">
                        |
                      </span>
                      <span>수량 {item.quantity}개</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-4 border-b pb-2">배송 정보</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="flex-shrink-0 text-gray-500 mr-2">
                    받는 분 :
                  </span>
                  <span>{payment.recipient_name}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500">휴대폰 번호 :</span>
                  <span>{payment.recipient_phone}</span>
                </li>
                <li className="flex items-stretch gap-2">
                  <span className="flex-shrink-0 text-gray-500">
                    배송지 정보 :
                  </span>
                  <span>
                    &#91;{payment.postal_code}&#93; {payment.address_line1}
                    {payment.address_line2}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex-1 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-4 border-b pb-2">결제 정보</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">총 주문 금액 :</span>
                  <span>{formatPrice(payment.amount)} 원</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">총 배송비 :</span>
                  {/* 추후 수정필요 */}
                  <span>0 원</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span className="text-gray-500">총 결제 금액 :</span>
                  <span className="font-bold text-base">
                    {formatPrice(payment.amount)} 원
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex-1 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-4 border-b pb-2">결제 수단</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-gray-500 mr-1">결제 방법 :</span>
                  <span>{payment.payment_method}</span>
                </li>
                <li>
                  <span className="text-gray-500 mr-1">본인 납부 :</span>
                  <span>
                    {payment.installment_months > 0
                      ? `${payment.installment_months}개월 할부`
                      : "일시불"}
                  </span>
                </li>
                <li>
                  <span className="text-gray-500 mr-1">결제 일시 :</span>
                  <span>
                    {new Date().toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
                <li>
                  <span className="text-gray-500 mr-1">주문 상태 :</span>
                  <span>{payment.status}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
