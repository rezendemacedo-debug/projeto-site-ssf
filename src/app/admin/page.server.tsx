import type { Metadata } from "next";
import { PageHead } from "@/components/ui/page-head";
import { messageRepository, userRepository } from "@/server/container";
import { markMessageRead, setMemberStatus } from "@/server/http/actions";
import { requireAdmin } from "@/server/http/session";

export const metadata: Metadata = { title: "Administração", robots: { index: false } };

const STATUS = { pending: "Pendente", active: "Ativo", blocked: "Suspenso" };

export default async function Admin() {
  const admin = await requireAdmin();
  const [users, messages] = await Promise.all([userRepository.list(), messageRepository.list()]);
  return (
    <>
      <PageHead title="Administração" />
      <div className="wrap" style={{ paddingBottom: 96 }}>
        <h2>Membros</h2>
        <div className="table-scroll" style={{ marginBlock: "20px 64px" }}>
          <table>
            <thead><tr><th>Nome</th><th>Cidade</th><th>Motivação</th><th>Situação</th><th>Ação</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}<br /><span className="muted">{u.email}</span></td><td>{u.city}</td><td>{u.motivation}</td><td>{STATUS[u.status]}</td>
                  <td>{u.id !== admin.id && (
                    <form action={setMemberStatus} className="inline"><input type="hidden" name="id" value={u.id} />
                      {u.status !== "active" && <button className="btn small" name="status" value="active">Aprovar</button>}
                      {u.status !== "blocked" && <button className="btn ghost small" name="status" value="blocked">Suspender</button>}
                    </form>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Mensagens</h2>
        {messages.length === 0 && <p className="muted" style={{ marginTop: 16 }}>Nenhuma mensagem recebida.</p>}
        <div className="stack" style={{ marginTop: 20 }}>
          {messages.map((m) => (
            <article key={m.id} className="notice">
              <h3>{m.subject}</h3><p className="muted">{m.name}, <a className="link" href={`mailto:${m.email}`}>{m.email}</a></p><p style={{ whiteSpace: "pre-wrap", marginBlock: 10 }}>{m.body}</p>
              {m.readAt ? <p className="muted">Lida</p> : <form action={markMessageRead}><input type="hidden" name="id" value={m.id} /><button className="btn ghost small">Marcar como lida</button></form>}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
