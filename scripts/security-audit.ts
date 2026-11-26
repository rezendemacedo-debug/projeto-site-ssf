/**
 * Auditoria de segurança de rotina: `npm run audit:security`.
 * Verifica dependências, segredos no repositório, ações do GitHub e o site publicado.
 * Termina com código 1 se algo falhar. A revisão manual do código alterado continua necessária
 * (veja docs/SEGURANCA.md).
 */
import { execFileSync, execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SITE = process.env.AUDIT_SITE_URL ?? "https://rezendemacedo-debug.github.io/projeto-site-ssf/";
const results: { ok: boolean; check: string; detail?: string }[] = [];
const record = (ok: boolean, check: string, detail?: string) => results.push({ ok, check, detail });
const run = (cmd: string) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

// 1. Dependências que vão para o site.
try {
  run("npm audit --omit=dev --json");
  record(true, "Dependências de produção sem vulnerabilidades conhecidas");
} catch (error) {
  const out = (error as { stdout?: string }).stdout ?? "{}";
  const total = JSON.parse(out).metadata?.vulnerabilities?.total ?? "?";
  record(false, "Dependências de produção", `${total} vulnerabilidade(s): rode npm audit --omit=dev`);
}

// 2. Segredos e arquivos sensíveis versionados.
const SECRET = String.raw`(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|re_[A-Za-z0-9]{24,}|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY|libsql://[^ "']*authToken)`;
let secrets = "";
try {
  // Sem shell: a expressão vai como argumento, sem risco de aspas quebrarem o comando.
  secrets = execFileSync("git", ["grep", "-nIE", SECRET, "--", ".", ":!package-lock.json", ":!scripts/security-audit.ts"], { encoding: "utf8" });
} catch (error) {
  // git grep sai com 1 quando não acha nada; qualquer outro erro é falha da auditoria.
  if ((error as { status?: number }).status !== 1) secrets = `erro ao procurar: ${(error as Error).message}`;
}
record(secrets === "", "Nenhum segredo no código versionado", secrets.split("\n").slice(0, 5).join(" | "));
const sensitive = run("git ls-files").split("\n").filter((f) => /(^|\/)\.env$|\.env\.(?!example$)|\.db$|\.sqlite$|\.pem$|id_rsa|ssf_deploy/.test(f));
record(sensitive.length === 0, "Nenhum arquivo sensível versionado", sensitive.join(", "));

// 3. Ações do GitHub fixadas por SHA e sem gatilhos perigosos.
for (const file of [".github/workflows/ci.yml", ".github/workflows/pages.yml"]) {
  const text = readFileSync(file, "utf8");
  const loose = [...text.matchAll(/uses:\s*([^\s#]+)/g)].map((m) => m[1]!).filter((u) => !/@[0-9a-f]{40}$/.test(u));
  record(loose.length === 0, `${file}: ações fixadas por SHA`, loose.join(", "));
  record(!text.includes("pull_request_target"), `${file}: sem pull_request_target`);
}

// 4. Site publicado (só leitura).
async function head(url: string, redirect: RequestRedirect = "manual") {
  return fetch(url, { redirect, headers: { "User-Agent": "ssf-security-audit" } });
}
try {
  const http = await head(SITE.replace("https://", "http://"));
  record(http.status >= 300 && http.status < 400 && (http.headers.get("location") ?? "").startsWith("https://"), "HTTP redireciona para HTTPS", `status ${http.status}`);
  const home = await head(SITE, "follow");
  record(home.ok, "Site no ar", `status ${home.status}`);
  record(!!home.headers.get("strict-transport-security"), "HSTS ativo");
  const html = await home.text();
  record(/http-equiv="Content-Security-Policy"/.test(html), "CSP presente na página");
  for (const path of [".env", ".git/config", "ssf.db", "data/catalog.json", "CLAUDE.md", "docs/SEGURANCA.md"]) {
    const res = await head(SITE + path);
    record(res.status === 404, `Arquivo interno não exposto: ${path}`, `status ${res.status}`);
  }
} catch (error) {
  record(false, "Site publicado", (error as Error).message);
}

for (const r of results) console.log(`${r.ok ? "OK   " : "FALHA"} ${r.check}${!r.ok && r.detail ? ` (${r.detail})` : ""}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed === 0 ? `\nAuditoria automática: ${results.length} verificações, nenhuma falha.` : `\nAuditoria automática: ${failed} falha(s).`);
process.exit(failed === 0 ? 0 : 1);
