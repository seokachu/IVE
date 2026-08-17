import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

//Accordion 루트는 single/multiple 유니언이라, 스토리 타입은 single 쪽으로 좁혀 쓴다
type AccordionSingleProps = Extract<React.ComponentProps<typeof Accordion>, { type: "single" }>;

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  args: { type: "single", collapsible: true },
  parameters: {
    docs: { description: { component: "배송·교환 안내처럼 접었다 펼치는 정보 영역에 사용한다." } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<AccordionSingleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="delivery">
        <AccordionTrigger>배송 안내</AccordionTrigger>
        <AccordionContent>결제일 기준 2~3 영업일 내 출고되며, 도서·산간 지역은 추가 배송비가 발생합니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="exchange">
        <AccordionTrigger>교환 · 환불</AccordionTrigger>
        <AccordionContent>수령 후 7일 이내 신청 가능하며, 개봉한 포토카드는 교환이 어렵습니다.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="notice">
        <AccordionTrigger>주의 사항</AccordionTrigger>
        <AccordionContent>랜덤 구성 상품은 특정 멤버를 지정할 수 없습니다.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
