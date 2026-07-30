# Zustand 전환 영향 범위

## 현재 Recoil 상태 목록

- `sessionState`
- `loadingState`
- `cartState`
- `agreementsState`
- `selectedItemState`
- `scrollState`

## 영향 범위 요약

### `sessionState`

가장 넓게 퍼져 있는 상태다. 인증, 마이페이지, 게시판 작성/댓글, 결제, 헤더 사용자 메뉴까지 전반에 연결되어 있다.

주요 사용처:

- `src/hooks/AuthGuard.tsx`
- `src/hooks/useUpdateUserSession.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useAuthGuard.ts`
- `src/app/mypage/**`
- `src/components/layout/header/components/**`
- `src/components/board/**`
- `src/components/cart/**`
- `src/components/payment/**`
- `src/components/mypage/**`
- `src/hooks/payment/usePaymentConfirmation.tsx`

권장 순서:

- 마지막 단계 전환

이유:

- 인증 초기화, 세션 갱신, 결제/주문 흐름이 모두 연결되어 있어 회귀 영향이 가장 크다.

### `cartState`

장바구니 전역 상태다. 로컬스토리지와 결제 흐름에 연결되어 있다.

주요 사용처:

- `src/components/cart/CartList.tsx`
- `src/components/cart/CartListItem.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/components/layout/header/components/CartIcon.tsx`
- `src/components/shop/product/ProductActions.tsx`
- `src/hooks/payment/useCartCleanup.ts`
- `src/hooks/payment/usePaymentConfirmation.tsx`
- `src/hooks/useSignOut.ts`

권장 순서:

- 중후반 단계 전환

이유:

- localStorage 동기화와 결제 후 정리 로직이 얽혀 있다.

### `agreementsState`

결제 약관 체크 상태다.

주요 사용처:

- `src/components/cart/OrderAgreements.tsx`
- `src/components/payment/PaymentButton.tsx`

권장 순서:

- 초중반 단계 전환

이유:

- 사용처가 좁고 상태 구조가 단순하다.

### `selectedItemState`

장바구니에서 선택된 상품 ID 목록이다.

주요 사용처:

- `src/components/cart/CartList.tsx`
- `src/components/cart/CartListItem.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/components/payment/PaymentButton.tsx`

권장 순서:

- 초중반 단계 전환

이유:

- `cartState`와 함께 움직이지만 자체 구조는 단순하다.

### `scrollState`

메인 페이지 헤더/비주얼 섹션 표시 상태다.

주요 사용처:

- `src/components/layout/header/Header.tsx`
- `src/components/main/VisualSection.tsx`

권장 순서:

- 1차 전환 대상

이유:

- 사용처가 2곳뿐이고 외부 의존성이 없다.

### `loadingState`

Recoil atom은 정의되어 있지만 현재 직접 사용처가 없다.

권장 순서:

- 보류 또는 삭제 검토

이유:

- 실제 로직은 `src/hooks/useLoading.ts`의 로컬 상태를 쓰고 있고, Recoil atom은 죽은 코드에 가깝다.

## 권장 전환 순서

1. `scrollState`
2. `agreementsState`
3. `selectedItemState`
4. `cartState`
5. `sessionState`
6. `loadingState` 정리 또는 삭제

## 이번 단계에서 실제 전환

- Zustand 의존성 설치
- Zustand store 초안 생성
- `scrollState`를 Recoil에서 Zustand로 전환

## 다음 단계 후보

- `agreementsState` + `selectedItemState` 동시 전환
- 이후 `cartState`
- 마지막에 `sessionState`와 `RecoilProvider` 제거
