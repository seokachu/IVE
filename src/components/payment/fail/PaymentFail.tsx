"use client";
import ActionButton from "@/components/common/button/ActionButton";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentFail = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const { push } = useRouter();

  const onClickGoToCart = () => {
    const savedCheckoutItems = localStorage.getItem("checkout_items");

    if (savedCheckoutItems) {
      try {
        const checkoutItems = JSON.parse(savedCheckoutItems);
        push(
          `/cart?selected=${encodeURIComponent(JSON.stringify(checkoutItems))}`
        );
      } catch (_error) {
        push("/cart"); // 파싱 실패시 장바구니로 이동
      }
    } else {
      push("/cart"); // 만약, checkout_items가 없을 때도 이동해야하니 cart로 이동하도록 유도
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center sm:-mt-20 md:mt-0">
        <h1 className="text-lg lg:text-2xl font-bold mb-4">
          결제가 실패 되었습니다.
        </h1>
        <p className="text-gray-600 mb-6">에러 사유 : {message}&#46;</p>
        <div className="flex gap-4 justify-center">
          <ActionButton
            onClick={onClickGoToCart}
            variant="primary"
            className="px-4 py-2"
          >
            장바구니로 돌아가기
          </ActionButton>
        </div>
      </div>
    </main>
  );
};

export default PaymentFail;
