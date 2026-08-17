import type { Meta, StoryObj } from "@storybook/nextjs-vite";

//디자인 시스템 §1 색상 — public/docs/design-system.md 와 1:1 대응
interface SwatchProps {
  //미리보기에 적용할 Tailwind 배경 클래스 (예: bg-purple-300)
  className: string;
  name: string;
  //globals.css 토큰명 또는 실제 값
  token: string;
  dark?: boolean;
}

const Swatch = ({ className, name, token, dark }: SwatchProps) => (
  <div className="flex flex-col gap-1.5">
    <div className={`h-16 w-full rounded-lg border border-gray-200 ${className}`} />
    <div className="flex flex-col">
      <span className="text-[13px] font-semibold">{name}</span>
      <span className="text-xs text-gray-500">{token}</span>
      {dark && <span className="text-[11px] text-purple-500 dark:text-purple-300">다크에서 값 반전</span>}
    </div>
  </div>
);

const Group = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">{children}</div>
  </section>
);

const meta = {
  title: "Foundations/Colors",
  parameters: {
    docs: {
      description: {
        component:
          "브랜드 팔레트·중립 램프·시맨틱 토큰. 중립 램프와 일부 브랜드 저채도 단계는 `.dark`에서 값이 반전되므로 툴바의 테마 토글로 함께 확인한다.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

//브랜드 — 기준색은 purple-300 (#DB97E9)
export const Brand: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Group title="Purple (기준 브랜드)" description="purple-300이 기준색이자 primary 토큰의 소스">
        <Swatch className="bg-purple-50" name="purple-50" token="--purple-50" dark />
        <Swatch className="bg-purple-100" name="purple-100" token="--purple-100" dark />
        <Swatch className="bg-purple-200" name="purple-200" token="--purple-200" dark />
        <Swatch className="bg-purple-300" name="purple-300 · DEFAULT" token="#db97e9" />
        <Swatch className="bg-purple-400" name="purple-400" token="#c876dc" />
        <Swatch className="bg-purple-500" name="purple-500" token="#a94fc0" />
      </Group>
      <Group title="Orange (액센트)" description="HOT 뱃지·강조 포인트">
        <Swatch className="bg-orange-100" name="orange-100" token="--orange-100" dark />
        <Swatch className="bg-orange-300" name="orange-300 · DEFAULT" token="#ff9f87" />
        <Swatch className="bg-orange-500" name="orange-500" token="#fd5631" />
      </Group>
    </div>
  ),
};

//중립 램프 — Tailwind 기본 gray를 디자인 시스템 값으로 재정의
export const Neutral: Story = {
  render: () => (
    <Group title="Gray" description="다크 테마에서 50↔900이 뒤집히는 값 기반 램프 (zinc 쿨톤)">
      <Swatch className="bg-gray-50" name="gray-50" token="--gray-50" dark />
      <Swatch className="bg-gray-100" name="gray-100" token="--gray-100" dark />
      <Swatch className="bg-gray-200" name="gray-200" token="--gray-200" dark />
      <Swatch className="bg-gray-300" name="gray-300" token="--gray-300" dark />
      <Swatch className="bg-gray-400" name="gray-400" token="--gray-400" dark />
      <Swatch className="bg-gray-500" name="gray-500" token="--gray-500" dark />
      <Swatch className="bg-gray-600" name="gray-600" token="--gray-600" dark />
      <Swatch className="bg-gray-700" name="gray-700" token="--gray-700" dark />
      <Swatch className="bg-gray-900" name="gray-900" token="--gray-900" dark />
    </Group>
  ),
};

//시맨틱 — shadcn 토큰에 브랜드를 연결한 결과
export const Semantic: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Group title="Surface" description="배경·카드·팝오버">
        <Swatch className="bg-background" name="background" token="--background" dark />
        <Swatch className="bg-card" name="card" token="--card" dark />
        <Swatch className="bg-popover" name="popover" token="--popover" dark />
        <Swatch className="bg-muted" name="muted" token="--muted" dark />
        <Swatch className="bg-secondary" name="secondary" token="--secondary" dark />
        <Swatch className="bg-accent" name="accent" token="--accent" dark />
      </Group>
      <Group title="Interactive" description="primary는 브랜드 퍼플, ring도 동일 색을 사용">
        <Swatch className="bg-primary" name="primary" token="290 65% 75%" />
        <Swatch className="bg-destructive" name="destructive" token="0 80% 52%" />
        <Swatch className="bg-border" name="border" token="--border" dark />
        <Swatch className="bg-input" name="input" token="--input" dark />
        <Swatch className="bg-ring" name="ring" token="--ring" />
      </Group>
      <Group title="Status / 고정색" description="테마와 무관하게 값이 고정되는 색">
        <Swatch className="bg-success" name="success" token="#22c55e" />
        <Swatch className="bg-warning" name="warning" token="#facc15" />
        <Swatch className="bg-info" name="info" token="#3b82f6" />
        <Swatch className="bg-red" name="red (error)" token="#e72424" />
        <Swatch className="bg-kakao" name="kakao" token="#fee500" />
      </Group>
    </div>
  ),
};
