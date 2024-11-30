import ActionButton from "@/components/common/button/ActionButton";

const page = () => {
  return (
    <section className="px-5 pt-14 pb-28 lg:px-8 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
      <div className="max-w-[1320px] w-full m-auto flex flex-col lg:flex-row gap-5">
        {/* <div className="flex-[2] p-10 border rounded-md bg-white shadow-sm min-h-[500px]">
          <h2 className="font-bold text-xl">결제가 완료되었습니다.</h2>
          <ul>
            <ul className="mt-4">
              <li>상품명: {orderName}</li>
              <li>결제 금액: {amount}원</li>
            </ul>
          </ul>
          <ActionButton variant="outline">주문상세 보기</ActionButton>
          <ActionButton variant="primary" className="py-2 ">
            홈으로 이동하기
          </ActionButton>
        </div> */}
      </div>
    </section>
  );
};

export default page;
