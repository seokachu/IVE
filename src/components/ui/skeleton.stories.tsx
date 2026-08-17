import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "@/components/ui/skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: "데이터 로딩 자리표시자. 페이지별 조합은 `src/components/common/loading`에 모아 둔다.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "h-6 w-48" },
};

//굿즈 카드 로딩 형태
export const ProductCard: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

//게시글 리스트 로딩 형태
export const ListRow: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  ),
};
