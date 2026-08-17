import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import QuantitySelector from "@/components/common/QuantitySelector";

//수량은 부모가 소유하는 값이라 스토리에서 상태를 붙여 실제 동작을 보여준다
const Stateful = ({ initial = 1 }: { initial?: number }) => {
  const [quantity, setQuantity] = useState(initial);
  return (
    <QuantitySelector
      quantity={quantity}
      increase={() => setQuantity((prev) => prev + 1)}
      decrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
    />
  );
};

const meta = {
  title: "Common/QuantitySelector",
  component: QuantitySelector,
  args: { quantity: 1, increase: fn(), decrease: fn() },
  parameters: {
    docs: {
      description: {
        component: "장바구니·상품 상세의 필 스테퍼. 수량이 1이면 감소 버튼이 비활성화된다.",
      },
    },
  },
} satisfies Meta<typeof QuantitySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

//감소 버튼 비활성 상태
export const MinQuantity: Story = {};

export const MultipleItems: Story = {
  args: { quantity: 3 },
};

export const Interactive: Story = {
  render: () => <Stateful initial={2} />,
};
