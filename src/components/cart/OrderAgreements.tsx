const OrderAgreements = () => {
  return (
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
  );
};

export default OrderAgreements;
