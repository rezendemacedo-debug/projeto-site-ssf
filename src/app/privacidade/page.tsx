import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";
import { IS_STATIC } from "@/content/site";

export const metadata: Metadata = { title: "Privacidade" };

export default function Privacy() {
  return (
    <>
      <PageHead title="Privacidade" />
      <div className="wrap narrow stack" style={{ paddingBottom: 96 }}>
        {!IS_STATIC && <><p>Guardamos apenas o que você envia no cadastro e no contato, e as aulas que marca. Convicção religiosa é dado sensível pela LGPD: usamos essas informações somente para atender seu pedido e nunca as vendemos.</p>
        <p>A senha é armazenada apenas como hash. Usamos um único cookie, necessário para manter sua sessão. Não usamos cookies de publicidade nem rastreadores.</p></>}
        {IS_STATIC && <p>Este site não tem cadastro, não coleta dados e não usa cookies próprios. A cidade escolhida e as páginas visitadas, para uso sem internet, ficam salvas só no seu aparelho. Os textos sagrados são buscados na API do Sefaria e as páginas são hospedadas no GitHub Pages, sujeitas às políticas desses serviços.</p>}
        <p>Os vídeos são reproduzidos pelo YouTube em modo de privacidade aprimorada, e as miniaturas vêm dos servidores do YouTube. Ao reproduzir, aplicam-se as políticas do Google.</p>
        <p>Para consultar, corrigir ou excluir seus dados, use a página de <Link className="link" href="/contato">contato</Link>.</p>
      </div>
    </>
  );
}
