import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Avoid accidental heavy logs in production
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Guard large object/array literals in JSX which may cause re-renders
      "react/jsx-no-constructed-context-values": "warn",
      // Prefer const to help V8 optimizations
      "prefer-const": "warn",
      // Encourage object/array immutability patterns
      "no-param-reassign": ["warn", { props: true }],
    },
  },
  // Relax console usage inside performance hooks and SW
  {
    files: ["src/hooks/**", "public/sw.js"],
    rules: {
      "no-console": "off",
    },
  },
];

export default eslintConfig;
