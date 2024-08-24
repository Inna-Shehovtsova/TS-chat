import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores:[
      "!dist/",".dist/*", ".dist/main.bundle.js"
    ],},
    {
    files: ["src/*.{js,mjs,cjs,ts}", "src/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
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
