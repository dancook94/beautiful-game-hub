import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
    files: ["src/components/prediction-game.tsx"],
    rules: {
      // Pre-existing localStorage hydration. Left in place so this change
      // stays inside Goal of the Week.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
