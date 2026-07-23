import { defineConfig, globalIgnores } from "eslint/config";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...coreWebVitals,
  ...nextTypescript,
  {
    // eslint-config-next 16(react-hooks v7)에서 추가된 신규 규칙.
    // 기존 코드 정리 전까지 warn으로 유지하고 점진적으로 해소한다.
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
