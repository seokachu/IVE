# IVE로 DIVE — 디자인 시스템

> 2026.07 리뉴얼 기준. 현재 코드베이스의 실제 사용 색·타이포·간격을 감사(audit)해서 정규화한 단일 소스입니다.
> 디자인 작업용 토큰은 Pencil 파일(`pencil-new.pen`)에 동일한 이름의 변수로 등록되어 있습니다.

## 0. 원칙

1. **시맨틱 토큰 우선** — `bg-purple`, `text-gray-500` 같은 원시 색 대신 `primary`, `text-secondary` 같은 역할 기반 토큰을 사용한다.
2. **한 가지 회색 램프만** — gray / zinc / slate / 커스텀 hex 혼용 금지. 아래 Neutral 램프만 사용.
3. **임의값 금지** — `p-[18px]`, `text-[50px]`, `bg-[#495057]` 같은 arbitrary value 대신 스케일 토큰 사용.
4. **화면당 Primary 버튼 1개** — 나머지는 Outline / Neutral / Ghost.

---

## 1. 색상 (Color)

### 1-1. 원시 팔레트 (Raw palette)

**Brand — Purple** (기존 `--purple: #DB97E9` 기준으로 램프 확장)

| 토큰 | HEX | 용도 |
|---|---|---|
| `purple-50` | `#FBF3FC` | 연한 배경 틴트 (선택 상태 bg 등) |
| `purple-100` | `#F5E3F8` | hover 배경 |
| `purple-200` | `#EBC4F2` | 보조 장식, 그래프 |
| `purple-300` | `#DB97E9` | **브랜드 기준색** (= 기존 `--purple`) |
| `purple-400` | `#C876DC` | primary hover |
| `purple-500` | `#A94FC0` | primary pressed, 밝은 배경 위 텍스트 |

**Brand — Orange** (기존 `--orange`, `--dark-orange`)

| 토큰 | HEX | 용도 |
|---|---|---|
| `orange-100` | `#FFEAE3` | 연한 배경 틴트 |
| `orange-300` | `#FF9F87` | 보조 강조 (= 기존 `custom-orange`) |
| `orange-500` | `#FD5631` | 강한 강조, HOT 뱃지 (= 기존 `dark-orange`) |

> 기존 `--pink: #E88EE2`는 코드에서 사용 0회 → **삭제**.

**Neutral** (기존에 흩어져 있던 9종 회색을 하나의 램프로 통합)

| 토큰 | HEX | 흡수한 기존 값 |
|---|---|---|
| `white` | `#FFFFFF` | `bg-white` |
| `gray-50` | `#F9F9F9` | `#f9f9f9` |
| `gray-100` | `#F5F5F5` | `#F5F5F5`, `bg-gray-100`, `bg-gray-50` |
| `gray-200` | `#EEEEEE` | `--silver-gray` |
| `gray-300` | `#CCCCCC` | `--dark-gray`, `#ccc` |
| `gray-400` | `#A0A0A0` | `#a0a0a0`, `text-gray-400`, `#878f91` |
| `gray-500` | `#6B7280` | `text-gray-500`(42회), `text-slate-500`, `#5e5e5e` |
| `gray-600` | `#495057` | `#495057`, `text-gray-600` |
| `gray-700` | `#333333` | `#333` |
| `gray-900` | `#0A0A0A` | `--font-primary`, `text-black` |

**Status / 고정색**

| 토큰 | HEX | 용도 |
|---|---|---|
| `success` | `#22C55E` | 성공, 완료 |
| `warning` | `#FACC15` | 경고, 별점 |
| `error` | `#E72424` | 에러, 필수 표시 (= 기존 `--red`) |
| `info` | `#3B82F6` | 정보 |
| `kakao` | `#FEE500` | 카카오 OAuth 버튼 전용 (변경 금지) |

### 1-2. 시맨틱 토큰 (실제로 사용하는 이름)

| 토큰 | 참조 | 용도 |
|---|---|---|
| `primary` | purple-300 | 주요 액션, 브랜드 강조 |
| `primary-hover` | purple-400 | primary hover |
| `primary-pressed` | purple-500 | primary pressed / 밝은 배경 위 브랜드 텍스트 |
| `primary-subtle` | purple-50 | 선택/활성 배경 |
| `accent` | orange-300 | 보조 강조 |
| `accent-strong` | orange-500 | 강한 보조 강조 |
| `text-primary` | gray-900 | 기본 텍스트 |
| `text-secondary` | gray-500 | 보조 텍스트 (메타 정보, 설명) |
| `text-tertiary` | gray-400 | 플레이스홀더, 비활성 안내 |
| `text-disabled` | gray-300 | 비활성 텍스트 |
| `text-inverse` | white | 어두운/브랜드 배경 위 텍스트 |
| `bg-page` | white | 페이지 배경 |
| `bg-subtle` | gray-50 | 섹션 구분 배경 |
| `bg-muted` | gray-100 | 카드/리스트 muted 배경 |
| `border-default` | gray-200 | 일반 구분선 |
| `border-strong` | gray-300 | 인풋 테두리 |
| `border-focus` | purple-300 | 포커스 링 |

> ⚠️ **접근성 주의**: `#DB97E9` 위 흰 텍스트는 명도 대비가 약 2.1:1로 낮습니다(브랜드 관례상 유지).
> 본문 크기 텍스트에 브랜드색을 쓸 때는 `primary`가 아니라 `primary-pressed`(#A94FC0)를 사용하세요.

### 1-3. 다크 테마 (2026-07-29 구현)

별도 시스템이 아니라 **같은 토큰의 두 번째 값**이다. 기본은 라이트, 헤더 토글로 옵트인(next-themes, class 전략).
브랜드 원색(purple-300~500, orange-300/500, status, kakao)은 다크에서도 동일하고, 아래만 플립된다:

다크 값은 **Pencil에서 확정한 zinc 쿨톤 팔레트**(2026-07-29 디자이너 확정)와 동기화한다:

| 토큰 | Light | Dark |
|---|---|---|
| `gray-50` ~ `gray-900` | #F9F9F9 → #0A0A0A | #1A1A1D → #F4F4F5 (zinc 역순 램프: 26262A·2E2E33·3F3F46·7A7A83·A1A1AA·D4D4D8·E4E4E7) |
| `purple-50` (틴트) | #FBF3FC | #2B2130 (100/200: #33193A / #46224F) |
| `orange-100` (틴트) | #FFEAE3 | #38201A |
| `--background` / `--card` | 흰색 / 흰색 | #1B1B1F / #1E1E21 (Pencil의 `bg-surface` = 코드의 `--card`) |
| `--border` / `--input` | 89.8% | #2E2E33 |

Pencil 전용 참고: `primary-hover`는 다크에서 더 밝은 보라($purple-200)로 반전, `text-disabled`(#52525B)와
`border-strong`(#3F3F46)은 디자인에선 분리 — 코드 raw 램프에서는 `gray-300` 다크값 #3F3F46 하나로 수렴.

**규칙**: 표면은 `bg-background`/`bg-card`(bg-white 금지 — 스위치 노브·이미지 위 오버레이만 예외),
이미지 위 오버레이는 테마 무관하게 `black/white + 투명도` 사용 (gray 램프는 변수 기반이라 불투명도 변형 불가).

---

## 2. 타이포그래피 (Typography)

**서체**: Pretendard 가변폰트 (`src/assets/fonts/fonts.tsx`, weight 45–920 전체 로드)

> 2026-08 변경: Noto Sans KR → Pretendard 가변폰트로 교체. 과거 지적됐던 weight 700 미로드·Arial 경합 버그는 해소됨.

| 스타일 | 크기 | 굵기 | 행간 | Tailwind | 용도 |
|---|---|---|---|---|---|
| Display | 36 | 700 | 1.2 | `text-4xl font-bold` | 히어로, 랜딩 타이틀 |
| Heading 1 | 24 | 700 | 1.2 | `text-2xl font-bold` | 페이지 타이틀 |
| Heading 2 | 20 | 700 | 1.4 | `text-xl font-bold` | 섹션 타이틀 |
| Heading 3 | 18 | 600 | 1.4 | `text-lg font-semibold` | 카드/상품명 |
| Body Large | 16 | 400 | 1.6 | `text-base` | 강조 본문 |
| Body | 14 | 400 | 1.6 | `text-sm` | **기본 본문** (최다 사용) |
| Caption | 12 | 400 | 1.4 | `text-xs text-secondary` | 날짜, 메타 정보 |

- 굵기는 **400 / 600 / 700 세 단계만** 사용 (`font-medium` 500은 600으로 통일).
- `text-3xl`(30), `text-6xl`(60)은 메인 히어로 한정 예외.

---

## 3. 간격 · 라운드 · 그림자

**Spacing** — 4px 배수만 사용: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`
(Tailwind `gap-1/2/3/4/5/6/8/10/12/16` — `gap-[2px]` 같은 임의값 금지)

**Radius**

| 토큰 | px | Tailwind | 용도 |
|---|---|---|---|
| `radius-sm` | 4 | `rounded-sm` | 뱃지, 체크박스 |
| `radius-md` | 6 | `rounded-md` | 버튼(md), 작은 카드 |
| `radius-lg` | 8 | `rounded-lg` | 버튼(lg), 인풋, 카드 |
| `radius-xl` | 16 | `rounded-2xl` | 모달, 바텀시트 |
| `radius-full` | 999 | `rounded-full` | 아바타, 필 버튼 |

**Shadow** — Tailwind 기본 3단계만: `shadow-sm`(리스트 아이템) / `shadow-md`(카드 hover) / `shadow-lg`(모달·드롭다운). 임의 그림자 금지.

---

## 4. 컴포넌트 규칙

Pencil에 재사용 컴포넌트로 등록된 목록과 대응 코드:

| Pencil 컴포넌트 | 스펙 | 코드 대응 |
|---|---|---|
| `Button/Primary` | h48 · radius-lg · primary bg · 16/600 흰 텍스트 | `ui/button.tsx` variant `default` (재정의 필요, 아래 §5) |
| `Button/Primary · md` | h40 · radius-md · 14/600 | size `default` |
| `Button/Outline` | 흰 bg · primary 테두리 · primary-pressed 텍스트 | variant `outlineBrand` |
| `Button/Neutral` | bg-muted · text-primary | variant `secondary` (중립 테두리는 `outline`) |
| `Button/Ghost` | 투명 · text-secondary | variant `ghost` |
| `Button/Destructive` | error bg · 흰 텍스트 | variant `destructive` |
| `Button/Disabled` | gray-100 bg · text-disabled | `disabled` 상태 |
| `Button/Kakao` | kakao bg · #191919 텍스트 | `OAuthButton` (아이콘은 실제 카카오 심볼 사용) |
| `Input/Default·Focus·Error` | h48 · radius-lg · border-strong/focus/error | `ui/input.tsx` + `form` |
| `Badge/Primary·Accent·Neutral` | 12/600 · radius-md · 색 = purple/orange-500/gray-500 | `common/Badge.tsx` |
| `Checkbox/Checked·Unchecked` | 18px · radius-sm · primary | 네이티브 checkbox `accent-color` |

**정리 방향 (현재 분열 상태 → 단일화)**
- ~~버튼 구현이 3갈래로 분열~~ → **2026-07-28 완료**: `ActionButton` 삭제, 27개 파일을 `ui/button.tsx`로 통일
  (`primary`→`default`, `outline`→`outlineBrand`, `default`→`outline`, 기존 여백 보존용 `size="auto"` 추가,
  `Button` 기본 `type="button"`).
- **2026-07-29 날 `<button>` 정리 완료**: 아이콘·인라인 유틸리티 버튼용 `plain` variant(배경·테두리 없음,
  포커스 링·disabled 처리만) 신설 후 15개 파일 17곳을 `<Button variant="plain" size="auto">`로 전환.
  예외: `PushSettingRow`는 `role="switch"` 토글이라 버튼 컴포넌트 대상이 아님.
- 제목(h2/h3 + text-xl font-bold 인라인 반복 20여 파일) → `SectionTitle` 공용 컴포넌트 신설 권장.
- shadcn `card`, `badge`, `tabs`가 없어 수제 구현이 흩어짐 → 필요 시 shadcn 추가 후 토큰 연결.

---

## 5. 코드 적용 — **2026-07-29 전면 적용 완료**

> 아래 스니펫 대로 적용됐고, 추가로:
> - Tailwind `gray`를 §1-1 Neutral 램프로 재정의(불투명도 변형 지원 위해 hex 리터럴), `red`는 DEFAULT #E72424 + 50~700 램프
> - legacy 토큰(`silver-gray`/`dark-gray`/`font-color`/`custom-orange`/`dark-orange`) **제거 완료** — 사용처 전부 치환됨
> - className이 아닌 JS 코드(별점·컨페티·아이콘 color)는 `COLORS` 상수 사용 (`src/utils/constants`)
> - `quill.css`는 `var(--gray-200)`/`var(--gray-400)` 참조 (globals.css에 gray 램프 CSS 변수 정의)

### 5-1. `globals.css` — 브랜드를 shadcn 토큰에 연결

```css
:root {
  /* Brand ramp */
  --purple-50: #fbf3fc;
  --purple-100: #f5e3f8;
  --purple-200: #ebc4f2;
  --purple-300: #db97e9;
  --purple-400: #c876dc;
  --purple-500: #a94fc0;
  --orange-100: #ffeae3;
  --orange-300: #ff9f87;
  --orange-500: #fd5631;

  /* shadcn 시맨틱 — primary를 무채색(검정)에서 브랜드 보라로 교체 */
  --primary: 290 65% 75%;            /* #DB97E9 */
  --primary-foreground: 0 0% 100%;
  --destructive: 0 80% 52%;          /* #E72424 */
  --ring: 290 65% 75%;

  /* 시맨틱 별칭 */
  --success: #22c55e;
  --warning: #facc15;
  --info: #3b82f6;
  --kakao: #fee500;
}
```

제거할 것: `--pink`(미사용), `body`의 Arial `font-family` 규칙.

### 5-2. `tailwind.config.ts`

```ts
colors: {
  purple: {
    50: "var(--purple-50)", 100: "var(--purple-100)", 200: "var(--purple-200)",
    300: "var(--purple-300)", 400: "var(--purple-400)", 500: "var(--purple-500)",
    DEFAULT: "var(--purple-300)",   // 기존 bg-purple 사용처 호환
  },
  orange: {
    100: "var(--orange-100)", 300: "var(--orange-300)", 500: "var(--orange-500)",
    DEFAULT: "var(--orange-300)",
  },
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  kakao: "var(--kakao)",
  // silver-gray, dark-gray, custom-orange, custom-pink, font-color → 마이그레이션 후 제거
}
```

### 5-3. 마이그레이션 치환표 (감사 기준 사용 빈도 포함) — ✅ 전부 치환 완료

| 현재 (빈도) | 변경 |
|---|---|
| `text-gray-500` (42) | `text-muted-foreground` 또는 `text-gray-500` 유지(램프 통일 후) |
| `bg-silver-gray` (11) | `bg-gray-200` 또는 `border-default` 역할이면 `border` |
| `*-dark-gray` (27) | `gray-300` |
| `custom-orange` / `dark-orange` | `orange-300` / `orange-500` |
| `text-slate-*`, `bg-zinc-*` | 동급 `gray-*` |
| `bg-[#F5F5F5]`, `bg-[#f9f9f9]` | `bg-gray-100`, `bg-gray-50` |
| `text-[#495057]` | `text-gray-600` |
| `text-[#878f91]`, `bg-[#a0a0a0]` | `gray-400` |
| `after:bg-[#333]` | `after:bg-gray-700` |
| `bg-[#fee500]` | `bg-kakao` |
| `text-rose-*`, `ring-red-400` 등 | `error` 계열로 통일 |
| `ActionButton` variant `primary` | `<Button>` (primary 재정의 후) |

### 5-4. 기타 정리

- **다크모드**: `.dark` 변수와 next-themes가 세팅돼 있으나 사용 0회. 당분간 라이트 고정 유지 — 토글 도입 시점에 위 토큰의 dark 값만 채우면 됨.
- **브레이크포인트 (2026-07-29 결정)**: `sm: 375px`는 45곳이 의존하므로 **유지** — 기본값(640px)으로 되돌리면 375~640px 구간 레이아웃이 전부 바뀌는 위험 대비 이득이 없음. `xl: 1320px`도 유지.
- **컨테이너 폭 토큰 (적용 완료)**: `max-w-container`(1320px) · `max-w-content`(1280px) — 임의값 `max-w-[1320px]` 등 22곳 치환 완료. 새 화면에서도 이 토큰만 사용.

---

## 6. 아이콘 · 로딩 (2026-07-29 통일)

- **아이콘은 `lucide-react` 단일 사용** — react-icons 제거됨. 채움 토글(하트·좋아요·별점)은 같은 아이콘에 `fill` 조건부로 표현
  (`<Heart fill={isWished ? "currentColor" : "none"} />`)
- **브랜드 로고**(구글·깃허브)는 lucide 미제공 → `components/common/icons/`의 커스텀 SVG 사용
- **로딩 표시는 `common/Spinner`만 사용** — react-spinners 제거됨 (lucide LoaderCircle + animate-spin)
- 진입 애니메이션은 tailwindcss-animate(`animate-in fade-in …`) 사용 — framer-motion 제거됨
- 남은 중복(후속 검토): 캐러셀 2종(swiper 커버플로우 + embla/ui-carousel), `quill` 직접 의존(타입용)

## 7. Pencil 파일 구성

`ive/design/ive-design-system.pen`

- **DS / Colors** — 원시 팔레트 + 시맨틱 스와치
- **DS / Typography** — 타입 스케일 스펙과 견본
- **DS / Spacing · Radius · Shadow** — 스케일 시각화
- **DS / Components** — 버튼 8종 · 인풋 3종 · 뱃지 3종 · 체크박스 2종 (전부 재사용 컴포넌트)
- 모든 토큰은 동일 이름의 Pencil 변수로 등록 (`$primary`, `$text-secondary`, `$space-16`, `$radius-lg` …)
- 화면 프레임(로그인/회원가입/등록하기)은 이 컴포넌트의 인스턴스로 조립
