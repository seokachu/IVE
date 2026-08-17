import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          "폼 안에서 값을 고르는 기본 셀렉트(Radix). 목록 정렬처럼 필 형태 트리거가 필요한 경우에는 `Common/SortDropdown`을 사용한다.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="옵션을 선택해 주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="s">S</SelectItem>
        <SelectItem value="m">M</SelectItem>
        <SelectItem value="l">L</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Grouped: Story = {
  render: (args) => (
    <Select {...args} defaultValue="album">
      <SelectTrigger className="w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>굿즈</SelectLabel>
          <SelectItem value="light-stick">응원봉</SelectItem>
          <SelectItem value="photo-card">포토카드</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>음반</SelectLabel>
          <SelectItem value="album">정규 앨범</SelectItem>
          <SelectItem value="single">싱글</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} disabled>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="품절된 옵션" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="s">S</SelectItem>
      </SelectContent>
    </Select>
  ),
};
