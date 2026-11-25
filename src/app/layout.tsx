import "@fontsource-variable/assistant";
import "@fontsource-variable/frank-ruhl-libre";
import "@fontsource-variable/noto-serif-hebrew";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/layout.css";
import "@/styles/components.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SacredBanner } from "@/components/layout/sacred-banner";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  appleWebApp: { capable: true, title: "SSF", statusBarStyle: "black" },
  formatDetection: { telephone: false },
  openGraph: { type: "website", locale: "pt_BR", siteName: SITE.name },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#2a1a0f" };

/** Os horários mudam o dia todo: páginas estáticas são refeitas a cada 5 minutos. */
export const revalidate = 300;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip" href="#conteudo">Ir para o conteúdo</a>
        <SacredBanner />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
