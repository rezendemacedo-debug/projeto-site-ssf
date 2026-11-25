import type { Metadata } from "next";
import Link from "next/link";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { PageHead } from "@/components/ui/page-head";
import type { Lesson } from "@/domain/lesson";
import { lessonService, savedLessonRepository } from "@/server/container";
import { logout } from "@/server/http/actions";
import { requireUser } from "@/server/http/session";

export const metadata: Metadata = { title: "Área de membros", robots: { index: false } };

export default async function Members() {
  const user = await requireUser();
  const saved = await savedLessonRepository.listByUser(user.id);
  const pick = (kind: string) => lessonService.byIds(saved.filter((s) => s.kind === kind).map((s) => s.lessonId));
  const [favorites, watched] = await Promise.all([pick("favorite"), pick("watched")]);
  return (
    <>
      <PageHead title={`Shalom, ${user.name.split(" ")[0]}`}>Seu estudo na Sinagoga Sem Fronteiras.</PageHead>
      <div className="wrap" style={{ paddingBottom: 96 }}>
        <div className="actions" style={{ marginTop: 0 }}>
          <Link className="btn" href="/aulas">Explorar aulas</Link>
          {user.role === "admin" && <Link className="btn ghost" href="/admin">Administração</Link>}
          <form action={logout}><button className="btn ghost">Sair</button></form>
        </div>
        <Shelf title="Favoritas" lessons={favorites} empty="Abra uma aula e adicione aos favoritos para encontrá-la aqui." />
        <Shelf title="Assistidas" lessons={watched} empty="As aulas marcadas como assistidas aparecem aqui." />
      </div>
    </>
  );
}

function Shelf({ title, lessons, empty }: { title: string; lessons: Lesson[]; empty: string }) {
  return <section style={{ marginTop: 64 }}><h2 style={{ marginBottom: 24 }}>{title}</h2>{lessons.length > 0 ? <LessonGrid lessons={lessons} /> : <p className="muted">{empty}</p>}</section>;
}
