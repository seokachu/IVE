import type { Meta, StoryObj } from "@storybook/nextjs-vite";

//디자인 시스템 §2 타이포그래피 — 서체 Pretendard Variable · 자간 -0.2px
const SCALE = [
  { name: "Display", cls: "text-4xl font-bold", spec: "36 / 700 / 1.2", usage: "히어로, 랜딩 타이틀" },
  { name: "Heading 1", cls: "text-2xl font-bold", spec: "24 / 700 / 1.2", usage: "페이지 타이틀" },
  { name: "Heading 2", cls: "text-xl font-bold", spec: "20 / 700 / 1.4", usage: "섹션 타이틀" },
  { name: "Heading 3", cls: "text-lg font-semibold", spec: "18 / 600 / 1.4", usage: "카드·상품명" },
  { name: "Body Large", cls: "text-base", spec: "16 / 400 / 1.6", usage: "강조 본문" },
  { name: "Body", cls: "text-sm", spec: "14 / 400 / 1.6", usage: "기본 본문 (최다 사용)" },
  { name: "Caption", cls: "text-xs text-gray-500", spec: "12 / 400 / 1.4", usage: "날짜·메타 정보" },
] as const;

const WEIGHTS = [
  { name: "Regular", cls: "font-normal", value: "400" },
  { name: "Semibold", cls: "font-semibold", value: "600" },
  { name: "Bold", cls: "font-bold", value: "700" },
] as const;

const meta = {
  title: "Foundations/Typography",
  parameters: {
    docs: {
      description: {
        component: "웨이트는 400 / 600 / 700 세 단계만 사용한다. `font-medium`(500)은 600으로 통일.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-gray-200">
      {SCALE.map((item) => (
        <div key={item.name} className="flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-8">
          <div className="w-40 shrink-0">
            <p className="text-[13px] font-semibold">{item.name}</p>
            <p className="text-xs text-gray-500">{item.spec}</p>
            <p className="text-xs text-gray-400">{item.cls}</p>
          </div>
          <p className={item.cls}>아이브로 다이브 — IVE DIVE</p>
          <span className="text-xs text-gray-500 md:ml-auto">{item.usage}</span>
        </div>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {WEIGHTS.map((weight) => (
        <div key={weight.name} className="flex items-baseline gap-6">
          <span className="w-32 text-xs text-gray-500">
            {weight.name} · {weight.value}
          </span>
          <p className={`text-xl ${weight.cls}`}>아이브로 다이브 0123 IVE DIVE</p>
        </div>
      ))}
    </div>
  ),
};
