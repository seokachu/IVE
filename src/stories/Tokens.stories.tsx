import type { Meta, StoryObj } from "@storybook/nextjs-vite";

//디자인 시스템 §3 간격 · 라운드 · 그림자
const SPACING = [
  { cls: "gap-1", px: 4 },
  { cls: "gap-2", px: 8 },
  { cls: "gap-3", px: 12 },
  { cls: "gap-4", px: 16 },
  { cls: "gap-5", px: 20 },
  { cls: "gap-6", px: 24 },
  { cls: "gap-8", px: 32 },
  { cls: "gap-10", px: 40 },
  { cls: "gap-12", px: 48 },
  { cls: "gap-16", px: 64 },
] as const;

const RADIUS = [
  { cls: "rounded-sm", px: "4", usage: "뱃지, 체크박스" },
  { cls: "rounded-md", px: "6", usage: "버튼(md), 작은 카드" },
  { cls: "rounded-lg", px: "8", usage: "버튼(lg), 인풋, 카드" },
  { cls: "rounded-2xl", px: "16", usage: "모달, 바텀시트" },
  { cls: "rounded-full", px: "999", usage: "아바타, 필 버튼" },
] as const;

const SHADOW = [
  { cls: "shadow-sm", usage: "리스트 아이템" },
  { cls: "shadow-md", usage: "카드 hover" },
  { cls: "shadow-lg", usage: "모달 · 드롭다운" },
] as const;

const BREAKPOINTS = [
  { name: "sm", px: "375px", usage: "모바일 기준" },
  { name: "md", px: "768px", usage: "태블릿" },
  { name: "lg", px: "1024px", usage: "데스크톱" },
  { name: "xl", px: "1320px", usage: "최대 컨테이너 (max-w-container)" },
] as const;

const meta = {
  title: "Foundations/Tokens",
  parameters: {
    docs: {
      description: {
        component: "간격은 4px 배수만 사용하고 `gap-[2px]` 같은 임의값은 금지. 그림자도 아래 3단계 외에는 쓰지 않는다.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {SPACING.map((item) => (
        <div key={item.cls} className="flex items-center gap-4">
          <span className="w-20 text-xs text-gray-500">{item.cls}</span>
          <span className="w-12 text-xs text-gray-400">{item.px}px</span>
          <div className="h-4 rounded-sm bg-purple-300" style={{ width: item.px }} />
        </div>
      ))}
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
      {RADIUS.map((item) => (
        <div key={item.cls} className="flex flex-col gap-2">
          <div className={`h-20 w-full border border-purple-300 bg-purple-50 ${item.cls}`} />
          <div>
            <p className="text-[13px] font-semibold">{item.cls}</p>
            <p className="text-xs text-gray-500">
              {item.px}px · {item.usage}
            </p>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Shadow: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3">
      {SHADOW.map((item) => (
        <div key={item.cls} className="flex flex-col gap-2">
          <div className={`flex h-20 items-center justify-center rounded-lg bg-card ${item.cls}`}>
            <span className="text-[13px] font-semibold">{item.cls}</span>
          </div>
          <p className="text-xs text-gray-500">{item.usage}</p>
        </div>
      ))}
    </div>
  ),
};

export const Breakpoints: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-gray-200">
      {BREAKPOINTS.map((item) => (
        <div key={item.name} className="flex items-center gap-6 py-3">
          <span className="w-12 text-[13px] font-semibold">{item.name}</span>
          <span className="w-20 text-xs text-gray-500">{item.px}</span>
          <span className="text-xs text-gray-500">{item.usage}</span>
        </div>
      ))}
    </div>
  ),
};
