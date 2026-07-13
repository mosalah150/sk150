import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // 1. Extend ESLint configurations using FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. Define global ignores
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "postcss.config.mjs",
    ],
  },

  // 3. Integrate Prettier config to disable formatting rule conflicts
  eslintConfigPrettier,
];

export default eslintConfig;
