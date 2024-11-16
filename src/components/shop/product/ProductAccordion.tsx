import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const ProductAccordion = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>판매자 고객센터</AccordionTrigger>
        <AccordionContent>
          <ul className="flex flex-col gap-3">
            <li>
              <h3 className="font-bold mb-1">운영시간</h3>
              <p>평일 09:00 ~ 18:00 점심 12:00 ~ 13:00 주말 휴무</p>
            </li>
            <li>
              <h3 className="font-bold mb-1">전화번호</h3>
              <p>1111-1000</p>
            </li>
            <li>
              <h3 className="font-bold mb-1">이메일</h3>
              <Link href="mailto:seokachuu@gmail.com">
                <p className="underline">seokachuu@gmail.com</p>
              </Link>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>배송 정보</AccordionTrigger>
        <AccordionContent>
          <ol className="flex flex-col gap-2">
            <li>배송방법 : 택배</li>
            <li>배송기간 : 평균 2-5일 이내 발송 &#40;영업일 기준&#41;</li>
            <li>
              천재지변, 물량 수급 변동, 택배사 사정 등의 불가항력적 사유로
              배송이 다소 늦어질 수 있습니다.
            </li>
            <li>
              배송은 배송일 공지 기준으로 출고되며, 예약배송 등 일정은 상품
              상세설명을 확인해주세요.
            </li>
            <li>
              &#42;제주도를 포함한 도서산간 지역은 배송 기간이 추가 소요 혹은
              배송이 불가할 수 있습니다.
            </li>
            <li>
              일부 상품, 일부 지역의 경우 추가 배송비 입금요청이 발생할 수
              있습니다.
            </li>
            <li className="py-3">
              <h3>&#42;제품 특성상 묶음 배송이 불가한 상품</h3>
              <ul className="pl-3">
                <li>화물 운임이 필요한 경우</li>
                <li>제주도 및 도서산간 지역인 경우</li>
              </ul>
            </li>
            <li>
              배송비는 주문시점에 함께 구매한 상품에 따라 금액이 달라질 수
              있습니다.
            </li>
            <li>
              묶음배송이 불가한 상품의 경우 별도 배송비가 발생할 수 있습니다.
            </li>
            <li>
              상품의 출고지에 따라 배송비가 별도 부과될 수 있으며, 배송비 무료
              조건이 달라질 수 있습니다.
            </li>
            <li>
              정확한 배송비, 반품&#47;교환비용은 주문시, 반품&#47;교환 접수 시에
              각각 확인 가능합니다.
            </li>
            <li>묶음배송 불가 상품의 경우 별도 반품비가 발생할 수 있습니다.</li>
          </ol>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>교환 반품 정책</AccordionTrigger>
        <AccordionContent>
          <ol className="flex flex-col gap-5">
            <li>
              <h3 className="font-bold mb-2">&#91;교환 &#47;반품 비용&#93;</h3>
              <ul>
                <li>교환 배송비 : 왕복 5000원</li>
                <li>
                  반품 배송비 : 부분 반품일 경우 2500원 &#47; 전체 반품일 경우
                  5000원
                </li>
                <li>
                  <p>제주&#47;도서산간 0원</p>
                  <p>
                    &#42;구매자의 단순변심에 의한 교환&#47;반품 배송 비용은
                    구매자가 부담합니다.
                  </p>
                </li>
                <li>
                  &#42;상품의 불량&#47;오배송 등의 사유에 의한 교환&#47;반품
                  배송 비용은 판매자가 부담합니다.
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold mb-2">
                &#91;교환&#47;반품 가능 기간&#93;
              </h3>
              <ul>
                <li>
                  구매자의 단순 변심으로 인한 반품&#47;교환은 상품 수령일로부터
                  7일 이내 가능합니다. <br />
                  &#40;단, 수령한 상품이 표시, 광고의 내용과 다른 경우 상품을
                  수령한 날부터 3개월 이내, 그 사실 안 날 또는 알 수 있었던
                  날로부터 30일 이내에는 환불 신청이 가능합니다.&#41;
                </li>
              </ul>
            </li>
            <li>
              <h3 className="font-bold mb-2">
                &#91;교환&#47;반품 안내사항&#93;
              </h3>
              <ul>
                <li>
                  교환/반품 요청은
                  <span className="text-bold">
                    &#91;마이페이지&#93;-&#91;주문&#47;배송&#93;-&#91;주문상세&#93;에서
                    가능합니다.
                  </span>
                </li>
                <li>
                  반품&#47;교환은 귀책사유에 따라 추가 비용이 발생할 수 있으니
                  반드시 판매자와 사전 협의를 해주시기 바랍니다.
                </li>
                <li>반품&#47;교환 시 상품의 수량 변경은 불가합니다.</li>
                <li>
                  반품&#47;교환에 따른 배송비 및 제주&#47;도서산간 비용이 발생할
                  수 있습니다.
                </li>
                <li>교환은 동일 상품의 옵션 교환에 한해 1회만 가능합니다.</li>
                <li>
                  교환 상품의 옵션 변경 시 금액 변동이 발생할 수 있습니다.
                </li>
                <li>
                  교환 요청 시 확인한 &#91;환불예상금액&#93;은 판매자가 직접
                  구매자의 환불계좌로 입금합니다.
                </li>
                <li>
                  교환은
                  <span className="font-bold">&apos;상품 수거 완료&apos;</span>
                  시점의 재고 사정에 따라 교환이 거부될 수 있으며, 판매자와
                  협의하여 기존 상품으로 재배송 또는 반품 처리할 수 있습니다.
                </li>
              </ul>
            </li>
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductAccordion;
