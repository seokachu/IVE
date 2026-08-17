import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DdayBadge from "@/components/common/DdayBadge";
import type { ScheduleItem } from "@/types/schedule";

//D-day는 오늘 기준으로 계산되므로 스토리에서도 상대 날짜로 만든다
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const schedule = (overrides: Partial<ScheduleItem> = {}): ScheduleItem => ({
  id: "schedule-1",
  title: "IVE THE 3RD FAN CONCERT",
  category: "concert",
  startsAt: daysFromNow(12),
  endsAt: null,
  location: "KSPO DOME",
  link: null,
  description: null,
  source: "manual",
  poster: null,
  ...overrides,
});

const meta = {
  title: "Common/DdayBadge",
  component: DdayBadge,
  args: { item: schedule() },
  parameters: {
    docs: {
      description: {
        component: "일정 카드·메인 티저 공통 D-day 뱃지. 상태(예정·당일·진행중·종료)는 일정 날짜에서 자동 계산된다.",
      },
    },
  },
} satisfies Meta<typeof DdayBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Upcoming: Story = {};

export const Today: Story = {
  args: { item: schedule({ startsAt: daysFromNow(0), endsAt: daysFromNow(0) }) },
};

export const Ongoing: Story = {
  args: { item: schedule({ startsAt: daysFromNow(-2), endsAt: daysFromNow(3), title: "팝업 스토어" }) },
};

export const Ended: Story = {
  args: { item: schedule({ startsAt: daysFromNow(-30), endsAt: daysFromNow(-28) }) },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <DdayBadge item={schedule({ startsAt: daysFromNow(12) })} />
      <DdayBadge item={schedule({ startsAt: daysFromNow(0), endsAt: daysFromNow(0) })} />
      <DdayBadge item={schedule({ startsAt: daysFromNow(-2), endsAt: daysFromNow(3) })} />
      <DdayBadge item={schedule({ startsAt: daysFromNow(-30), endsAt: daysFromNow(-28) })} />
    </div>
  ),
};
