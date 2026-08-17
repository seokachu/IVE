import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Badge from "@/components/common/Badge";
import type { BadgeFields } from "@/utils/calculateBadge";

//NEW는 "지금"을 기준으로 판정되므로 스토리에서는 상대 날짜로 만든다 (캡처 시점과 무관하게 동일)
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

//뱃지는 상품 데이터에서 파생된다 — NEW(등록 30일 이내) > HOT(최근 90일 리뷰 5건 이상 & 평점 4.0 이상) > 무료배송
const goods = (overrides: Partial<BadgeFields> = {}): BadgeFields => ({
  id: "goods-1",
  shipping_type: "무료배송",
  recent_review_count: 12,
  created_at: daysAgo(200),
  ...overrides,
});

const meta = {
  title: "Common/Badge",
  component: Badge,
  args: { item: goods(), averageRating: 4.6 },
  argTypes: {
    shape: { control: "inline-radio", options: ["rounded", "pill"] },
    averageRating: { control: { type: "range", min: 0, max: 5, step: 0.1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "굿즈 카드·상세에 붙는 파생 뱃지. 조건을 만족하는 뱃지가 없으면 아무것도 렌더하지 않는다 (`calculateBadge`).",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

//상세 구매 카드용 — 라운드 필 형태
export const Pill: Story = {
  args: { shape: "pill" },
};

export const Conditions: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-64 text-xs text-gray-500">등록 5일 · 무료배송 · 최근 리뷰 12 · 평점 4.6</span>
        <Badge {...args} item={goods({ created_at: daysAgo(5) })} averageRating={4.6} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-64 text-xs text-gray-500">무료배송 + HOT — 최근 리뷰 12건</span>
        <Badge {...args} item={goods()} averageRating={4.6} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-64 text-xs text-gray-500">NEW만 — 일반배송 · 최근 리뷰 3건</span>
        <Badge
          {...args}
          item={goods({ created_at: daysAgo(2), shipping_type: "일반배송", recent_review_count: 3 })}
          averageRating={4.9}
        />
      </div>
      <div className="w-64 flex items-center gap-3">
        <span className="w-64 text-xs text-gray-500">HOT만 — 일반배송 · 최근 리뷰 40 · 평점 4.2</span>
        <Badge {...args} item={goods({ shipping_type: "일반배송", recent_review_count: 40 })} averageRating={4.2} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-64 text-xs text-gray-500">조건 미충족 — 최근 리뷰 2건 · 평점 3.1</span>
        <Badge {...args} item={goods({ shipping_type: "일반배송", recent_review_count: 2 })} averageRating={3.1} />
      </div>
    </div>
  ),
};
