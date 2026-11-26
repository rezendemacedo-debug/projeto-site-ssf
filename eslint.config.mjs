import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // Desestruturar para omitir campos (ex.: `passwordHash: _hash, ...user`) é intencional.
      "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true, argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  { ignores: [".next/**", "out/**", "node_modules/**", "drizzle/**", "next-env.d.ts"] },
];

export default config;
