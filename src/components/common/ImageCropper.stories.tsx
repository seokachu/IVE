import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import ImageCropper from "@/components/common/ImageCropper";
import { Button } from "@/components/ui/button";

//모달은 열린 상태로만 렌더되는 컴포넌트라, 스토리에서는 트리거 버튼으로 열고 닫는다
const Trigger = ({ imageSrc }: { imageSrc: string }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button variant="outlineBrand" onClick={() => setIsOpen(true)}>
        크롭 모달 열기
      </Button>
      <ImageCropper
        imageSrc={imageSrc}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={async () => {
          //업로드 소요 시간 모사 — 저장 중 상태 확인용
          await new Promise((resolve) => setTimeout(resolve, 1200));
          setIsOpen(false);
        }}
      />
    </>
  );
};

const meta = {
  title: "Common/ImageCropper",
  component: ImageCropper,
  args: {
    imageSrc: "/images/news_hero_bg.jpg",
    isOpen: true,
    onClose: fn(),
    onSave: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "프로필 이미지 크롭 모달(react-easy-crop). 드래그로 위치, 휠·핀치·슬라이더로 배율을 조정하고 원형 마스크 기준으로 잘라 Blob을 넘긴다. 저장 성공 시 닫기는 부모가 처리한다.",
      },
    },
  },
} satisfies Meta<typeof ImageCropper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Trigger imageSrc="/images/news_hero_bg.jpg" />,
};
