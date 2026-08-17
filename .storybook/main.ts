import path from "node:path";
import remarkGfm from "remark-gfm";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    //MDX 문서의 표·취소선은 GFM 확장이라 remark 플러그인을 따로 붙여야 렌더된다
    {
      name: "@storybook/addon-docs",
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  //앱과 동일한 정적 자산 경로(/images/...)를 스토리에서도 그대로 쓰기 위해
  staticDirs: ["../public"],
  //인터페이스 주석까지 Docs 프롭 테이블에 노출 (디자인 시스템 문서 목적)
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        "@": path.resolve(import.meta.dirname, "../src"),
      },
    },
  }),
};

export default config;
