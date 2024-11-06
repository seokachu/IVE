const CartSummary = () => {
  return (
    <div className="lg:sticky lg:top-5 flex-1 border rounded-md bg-white shadow-sm p-10 h-fit">
      <h2 className="font-bold text-xl mb-5">결제 금액</h2>
      <div className="border-b pb-3 flex justify-between items-center">
        <p>총 결제 금액</p>
        <p>
          <strong className="text-xl mr-1 text-purple">270,545</strong>원
        </p>
      </div>
      <div className="pt-5 mb-10">
        <p className="mb-1 flex justify-between items-center">
          상품 금액
          <span>377,300원</span>
        </p>
        <p className="flex justify-between items-center">
          총 할인 금액
          <span className="text-dark-orange">-73,755원</span>
        </p>
      </div>
      <button className="block text-center w-full rounded-md py-2 bg-purple text-white">
        결제하기
      </button>
    </div>
  );
};

export default CartSummary;
