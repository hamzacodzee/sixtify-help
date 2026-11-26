import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],
      "object-shorthand": ["error", "always"],
      curly: "error",
      quotes: ["error", "double"],
      "import/no-duplicates": ["error"],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-template-curly-in-string": "error",
      "no-use-before-define": "error",
      "no-console": "error",
      "no-empty-function": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-else-return": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*"],
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["case", "default"], next: "*" },
        { blankLine: "always", prev: "directive", next: "*" },
        { blankLine: "any", prev: "directive", next: "directive" },
        { blankLine: "always", prev: ["var", "let", "const"], next: "*" },
        { blankLine: "always", prev: "*", next: ["var", "let", "const"] },
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "*", next: "if" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
