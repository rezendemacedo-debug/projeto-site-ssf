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
        <p>No cadastro de membro, enviamos ao seu e-mail um código de 6 números, válido por 15 minutos, para confirmar que o endereço é seu. Os campos do perfil são opcionais. Ao final, você decide se envia seus dados à sinagoga pelo WhatsApp.</p>
        <p>A senha é armazenada apenas como hash, e o código de confirmação também não fica guardado em texto. Usamos só cookies necessários: um para manter sua sessão e outro, de 2 horas, para acompanhar as etapas do cadastro. Não usamos cookies de publicidade nem rastreadores.</p></>}
        {IS_STATIC && <p>Este site não guarda dados pessoais e não usa cookies próprios. No formulário &quot;Seja membro&quot;, o que você preenche segue apenas na mensagem que você mesmo envia pelo WhatsApp à sinagoga. A cidade escolhida e as páginas visitadas, para uso sem internet, ficam salvas só no seu aparelho. Os textos sagrados são buscados na API do Sefaria e as páginas são hospedadas no GitHub Pages, sujeitas às políticas desses serviços.</p>}
        <p>Os vídeos são reproduzidos pelo YouTube em modo de privacidade aprimorada, e as miniaturas vêm dos servidores do YouTube. Ao reproduzir, aplicam-se as políticas do Google.</p>
        <p>Para consultar, corrigir ou excluir seus dados, use a página de <Link className="link" href="/contato">contato</Link>.</p>
      </div>
    </>
  );
}
