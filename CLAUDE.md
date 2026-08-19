# IVE로 DIVE — 프로젝트 가이드

## 디자인 SSOT (핸드오프)

UI 작업 시 아래 토큰·규칙이 단일 기준(SSOT)이다. 상세 근거·마이그레이션 이력은
`public/docs/design-system.md`, 컴포넌트 실물은 Storybook(https://ive-storybook.vercel.app),
디자인 원본은 `design/ive-design-system.pen`(Pencil) 참고. 문서 간 충돌 시 **이 문서 → design-system.md → 코드** 순으로 따른다.

### 색상

토큰은 전부 CSS 변수 기반(`globals.css`)이라 `.dark`에서 자동 플립된다.
`bg-gray-100`, `text-gray-500`처럼 토큰 클래스만 쓰면 다크모드가 공짜로 대응된다.

- **브랜드 보라** `purple-50~500`, 기준색 `purple-300 #DB97E9` (= shadcn `primary`)
- **보조 오렌지** `orange-100/300/500` (`#FFEAE3` / `#FF9F87` / `#FD5631`)
- **Neutral** `gray-50~900` 램프만 사용 — slate/zinc/stone/임의 hex 금지
- **Status** `success #22C55E` · `warning #FACC15` · `info #3B82F6` · `red(error) #E72424` · `kakao #FEE500`(카카오 버튼 전용, 변경 금지)
- shadcn 시맨틱: `primary`=보라, `destructive`=`#E72424`, `ring`=보라, 표면은 `bg-background`/`bg-card`
- JS 코드에서 색이 필요하면(아이콘 color, 컨페티 등) `COLORS` 상수 사용 (`src/utils/constants`)

규칙:
- 표면 배경은 `bg-background`/`bg-card` — `bg-white` 금지(스위치 노브·이미지 위 오버레이만 예외)
- 이미지 위 오버레이는 `black/white + 투명도`만 (gray 램프는 변수라 `/50` 불투명도 변형 불가)
- 임의값 금지: `bg-[#495057]`, `text-[50px]`, `p-[18px]` 등 → 반드시 토큰 사용
- 접근성: `#DB97E9` 위 흰 텍스트는 대비 약 2.1:1 — 본문 크기 브랜드 텍스트는 `purple-500(#A94FC0)` 사용
- 화면당 Primary 버튼은 1개, 나머지는 Outline/Neutral/Ghost

### 타이포그래피

서체: **Pretendard 가변폰트**(`src/assets/fonts/fonts.tsx`, weight 45–920 전체 로드).

| 스타일 | Tailwind | 용도 |
|---|---|---|
| Display | `text-4xl font-bold` | 히어로 |
| H1 | `text-2xl font-bold` | 페이지 타이틀 |
| H2 | `text-xl font-bold` | 섹션 타이틀 |
| H3 | `text-lg font-semibold` | 카드/상품명 |
| Body | `text-sm` | **기본 본문** |
| Body Large | `text-base` | 강조 본문 |
| Caption | `text-xs text-gray-500` | 날짜·메타 |

굵기는 **400/600/700 세 단계만** (`font-medium` 500 금지 → 600).

### 간격 · 라운드 · 그림자 · 레이아웃

- **Spacing**: 4px 배수만 (`gap-1/2/3/4/5/6/8/10/12/16`)
- **Radius**: 뱃지·체크박스 `rounded-sm`(4) · 버튼md `rounded-md`(6) · 버튼lg·인풋·카드 `rounded-lg`(8) · 모달·바텀시트 `rounded-2xl`(16) · 아바타 `rounded-full`
- **Shadow**: `shadow-sm`/`shadow-md`/`shadow-lg` 3단계만, 임의 그림자 금지
- **컨테이너**: `max-w-container`(1320px) / `max-w-content`(1280px) — `max-w-[1320px]` 같은 임의값 금지
- **브레이크포인트**: `sm 375` / `md 768` / `lg 1024` / `xl 1320` (기본값과 다름 — 변경 금지)

### 컴포넌트 규칙

- 버튼은 `ui/button.tsx` 단일 사용. variants: `default`(브랜드) · `outlineBrand` · `outline`(중립) · `secondary` · `ghost` · `destructive` · `kakao` · `plain`(아이콘·인라인용, `size="auto"`와 함께) · `link`
- 아이콘은 **lucide-react만** (react-icons 금지). 채움 토글은 같은 아이콘에 `fill` 조건부. 브랜드 로고(구글·깃허브)만 `components/common/icons/` 커스텀 SVG
- 로딩은 `common/Spinner`만 (react-spinners 금지)
- 진입 애니메이션은 tailwindcss-animate(`animate-in fade-in …`) — framer-motion 금지
- 다크모드는 next-themes class 전략, 브랜드 원색(purple 300+/orange 300+/status)은 다크에서도 동일
