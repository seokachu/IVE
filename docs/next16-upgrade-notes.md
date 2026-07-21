# Next 16 업그레이드 노트 (2026-07-21)

`chore/upgrade-next16` 브랜치에서 Next 14.2 → 16.2.10, React 18 → 19.2 업그레이드 완료.
빌드 · 타입체크 · lint · E2E(15/15) 통과. 상세 변경 내역은 git log 참고.

## 폴더 이동 후 해야 할 일

프로젝트 경로에 한글(`IVE개인포폴`)이 있으면 Turbopack이 빌드 중 panic한다
(turbopack-core/ident.rs char boundary 버그, 16.2.10 기준 재현).
현재 package.json의 dev/build 스크립트에 `--webpack` 플래그로 우회 중.

폴더를 ASCII 경로로 옮긴 뒤:

1. `rm -rf .next node_modules && pnpm install` (캐시/절대경로 정리)
2. package.json의 dev/build에서 `--webpack` 플래그 제거
3. `pnpm build`로 Turbopack 빌드 확인 → 성공하면 커밋
4. `pnpm test:e2e`로 회귀 확인

## 남은 정리 거리

- lint 경고 23건: eslint-config-next 16의 react-hooks v7 신규 규칙
  (`set-state-in-effect`, `refs` 등)이 기존 코드 패턴을 지적. eslint.config.mjs에서
  warn으로 낮춰둔 상태이며 점진적으로 해소 후 error로 복원할 것.
- E2E는 프로덕션 빌드(`build + start`) 기준, 포트 3001 사용.
  3000은 다른 로컬 프로젝트(fitpick) dev 서버와 충돌 이력이 있음.

## 다음 로드맵

- 이 브랜치를 main에 머지해 안정화한 뒤 Expo 하이브리드 웹앱 착수 예정.
