import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["!dist/", ".dist/*", "functions/*"],
  },
  {
    ignores: ["!dist/", ".dist/*", "functions/*"],
    files: ["src/*.{js,mjs,cjs,ts}", "src/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports":"warn"
    },
  },
  {
    files: ["webpack.config.js", "jest.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
];
