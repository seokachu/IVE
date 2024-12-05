import ActionButton from "@/components/common/button/ActionButton";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";

const page = () => {
  return (
    <main>
      <section className="px-5 pt-14 pb-28 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-[1320px] w-full m-auto flex flex-col gap-5 px-5">
          <div className="flex flex-col gap-4 items-center mb-10">
            <h2 className="font-bold text-xl">주문이 완료되었습니다.</h2>
            <h3 className="text-gray-500">주문상품 번호 : 12345</h3>
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
                <span>총 1개</span>
              </strong>
            </h2>
            <ul className="flex flex-col w-full">
              <li className="flex gap-4 items-center mb-5 p-4 rounded-lg bg-[#F5F5F5]">
                <Image
                  src={DefaultImage}
                  alt="이미지"
                  className="w-20 h-20 object-cover rounded-md border"
                  width={500}
                  height={500}
                />
                <div>
                  <p className="text-sm text-gray-500">IVE-DIVE</p>
                  <strong className="font-semibold">
                    IVE - 앨범 DIVE (BLACK)
                  </strong>
                  <p className="text-sm">
                    <span>45,000원</span>
                    <span className="px-1 inline-block -translate-y-[1px]">
                      |
                    </span>
                    <span>수량 1개</span>
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-center mb-5 p-4 rounded-lg bg-[#F5F5F5]">
                <Image
                  src={DefaultImage}
                  alt="이미지"
                  className="w-20 h-20 object-cover rounded-md border"
                  width={500}
                  height={500}
                />
                <div>
                  <p className="text-sm text-gray-500">IVE-DIVE</p>
                  <strong className="font-semibold">
                    IVE - 앨범 DIVE (BLACK)
                  </strong>
                  <p className="text-sm">
                    <span>45,000원</span>
                    <span className="px-1 inline-block -translate-y-[1px]">
                      |
                    </span>
                    <span>수량 1개</span>
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-center mb-5 p-4 rounded-lg bg-[#F5F5F5]">
                <Image
                  src={DefaultImage}
                  alt="이미지"
                  className="w-20 h-20 object-cover rounded-md border"
                  width={500}
                  height={500}
                />
                <div>
                  <p className="text-sm text-gray-500">IVE-DIVE</p>
                  <strong className="font-semibold">
                    IVE - 앨범 DIVE (BLACK)
                  </strong>
                  <p className="text-sm">
                    <span>45,000원</span>
                    <span className="px-1 inline-block -translate-y-[1px]">
                      |
                    </span>
                    <span>수량 1개</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-4 border-b pb-2">배송 정보</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-gray-500">받는 분 :</span>
                  <span>홍길동</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500">휴대폰 번호 :</span>
                  <span> 010-0020-2022</span>
                </li>
                <li className="flex items-stretch gap-2">
                  <span className="flex-shrink-0 text-gray-500">
                    배송지 정보 :
                  </span>
                  <span>
                    (13536) 경기 성남시 분당구 판교역로 4 (백현동) T11
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex-1 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-4 border-b pb-2">결제 정보</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">총 주문 금액 :</span>
                  <span>45,000 원</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">총 배송비 :</span>
                  <span>0 원</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span className="text-gray-500">총 결제 금액 :</span>
                  <span className="font-bold text-base">45,000 원</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold mb-4 border-b pb-2">결제 수단</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-gray-500 mr-1">결제 방법 :</span>
                  <span>토스페이 간편결제</span>
                </li>

                <li>
                  <span className="text-gray-500 mr-1">본인 납부 :</span>
                  <span>일시불</span>
                </li>
                <li>
                  <span className="text-gray-500 mr-1">결제 일시 :</span>
                  <span>2024-08-21</span>
                </li>
                <li>
                  <span className="text-gray-500 mr-1">주문 상태 :</span>
                  <span>결제완료</span>
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
