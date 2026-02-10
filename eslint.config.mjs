import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. React & Next.js
            ["^react", "^next"],

            // 2. External packages
            ["^@?\\w"],

            // 3. Absolute imports (aliases)
            ["^@/"],

            // 4. Side effect imports
            ["^\\u0000"],

            // 5. Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./"],

            // 6. Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/first": "error",
      "import/no-duplicates": "error",
    },
  },
]);

export default eslintConfig;
