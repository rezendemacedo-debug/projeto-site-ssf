import type { NextConfig } from "next";
import { contentSecurityPolicy } from "./src/content/security";

const isDev = process.env.NODE_ENV === "development";

const csp = contentSecurityPolicy({ dev: isDev });

/** Versão estática para o GitHub Pages: páginas *.static.tsx no lugar das *.server.tsx. */
const pagesConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: true,
  pageExtensions: ["static.tsx", "static.ts", "tsx", "ts"],
  images: { unoptimized: true },
};

const serverConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["server.tsx", "server.ts", "tsx", "ts"],
  poweredByHeader: false,
  outputFileTracingIncludes: { "/biblioteca/**": ["./data/translations/**"] },
  serverExternalPackages: ["@libsql/client"],
  images: { remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }] },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
      ],
    },
  ],
};

export default process.env.NEXT_PUBLIC_STATIC === "1" ? pagesConfig : serverConfig;
