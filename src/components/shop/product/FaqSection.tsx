"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Clock3, Mail, Phone } from "lucide-react";

//시안 기준: FAQ 스플릿 레이아웃 — 왼쪽 타이틀 + 고객센터 카드, 오른쪽 질문형 아코디언 카드
const FAQ_ITEMS = [
  {
    question: "배송은 얼마나 걸리나요?",
    answer:
      "평균 2-5일 이내 발송됩니다 (영업일 기준). 천재지변, 물량 수급 변동, 택배사 사정 등의 불가항력적 사유로 다소 늦어질 수 있으며, 제주도를 포함한 도서산간 지역은 배송 기간이 추가로 소요되거나 배송이 불가할 수 있습니다.",
  },
  {
    question: "교환 / 반품은 어떻게 하나요?",
    answer:
      "[마이페이지] - [주문/배송] - [주문상세]에서 신청할 수 있습니다. 단순 변심에 의한 반품/교환은 상품 수령일로부터 7일 이내 가능하며, 교환은 동일 상품의 옵션 교환에 한해 1회만 가능합니다. 귀책사유에 따라 추가 비용이 발생할 수 있으니 판매자와 사전 협의를 해주세요.",
  },
  {
    question: "교환 / 반품 비용은 얼마인가요?",
    answer:
      "교환 배송비는 왕복 5,000원, 반품 배송비는 부분 반품 2,500원 / 전체 반품 5,000원입니다. 단순 변심에 의한 교환/반품 비용은 구매자가, 상품 불량/오배송에 의한 비용은 판매자가 부담합니다.",
  },
  {
    question: "묶음배송이 가능한가요?",
    answer:
      "기본적으로 가능하지만 화물 운임이 필요한 상품, 제주도 및 도서산간 지역은 묶음배송이 불가합니다. 상품의 출고지에 따라 배송비가 별도 부과될 수 있으며, 묶음배송 불가 상품은 별도 반품비가 발생할 수 있습니다.",
  },
];

const CONTACT_LINES = [
  { Icon: Clock3, text: "평일 09:00 – 18:00 · 점심 12:00 – 13:00" },
  { Icon: Phone, text: "1111-1000" },
  { Icon: Mail, text: "seokachuu@gmail.com" },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="m-auto max-w-container px-5 pt-20 lg:px-8 lg:pt-24">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="flex flex-col gap-3.5 lg:w-[400px] lg:shrink-0">
          <span className="text-[11px] font-bold tracking-[2px] text-orange-500">SUPPORT</span>
          <h2 className="text-2xl font-bold lg:text-[1.875rem]">궁금한 점이 있나요?</h2>
          <p className="text-sm leading-relaxed text-gray-500">주문 · 배송 · 교환 관련 자주 묻는 질문을 모았어요.</p>
          <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-purple-50 p-5 lg:p-6">
            <h3 className="text-sm font-bold">판매자 고객센터</h3>
            {CONTACT_LINES.map(({ Icon, text }) => (
              <p key={text} className="flex items-center gap-2 text-[13px] text-gray-500">
                <Icon size={15} className="shrink-0 text-purple-400" aria-hidden />
                {text}
              </p>
            ))}
            <div className="mt-1.5">
              <Link
                href="mailto:seokachuu@gmail.com"
                className="inline-flex items-center gap-1.5 rounded-full border border-purple bg-card px-5 py-2.5 text-[13px] font-semibold text-purple-500 transition-colors hover:bg-purple-50"
              >
                판매자 문의하기
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <ul className="flex flex-1 flex-col gap-3">
          {FAQ_ITEMS.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            return (
              <li
                key={question}
                className={`overflow-hidden rounded-2xl transition-colors ${
                  isOpen ? "border-[1.5px] border-purple bg-card" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {/* 카드 어디를 눌러도 열리도록 버튼이 패딩 영역까지 차지 */}
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left lg:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5 text-[15px] font-bold">
                    <span className="text-orange-500">Q.</span>
                    {question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-purple-400" : "text-gray-400"
                    }`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 pl-[46px] text-sm leading-relaxed text-gray-500 lg:px-6 lg:pl-[50px]">
                    {answer}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FaqSection;
