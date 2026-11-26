/**
 * Política de segurança de conteúdo (CSP): só o próprio site executa scripts; as exceções são
 * os serviços que o site usa de fato (Sefaria, miniaturas e vídeos do YouTube, câmeras do Kotel).
 * A versão com servidor envia como cabeçalho; o GitHub Pages não permite cabeçalhos próprios,
 * então a versão estática a declara numa tag <meta> (que ignora `frame-ancestors`).
 */
export function contentSecurityPolicy({ dev = false, meta = false } = {}) {
  return [
    "default-src 'self'",
    // O Next exporta scripts inline sem nonce na versão estática; por isso 'unsafe-inline'.
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://i.ytimg.com",
    "font-src 'self'",
    `connect-src 'self' https://www.sefaria.org${dev ? " ws:" : ""}`,
    "frame-src https://www.youtube-nocookie.com https://wm.cast-tv.com",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(meta ? [] : ["frame-ancestors 'none'"]),
  ].join("; ");
}
