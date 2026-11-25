import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { categoryBySlug, thumbnailUrl } from "@/domain/lesson";
import { lessonService, savedLessonRepository } from "@/server/container";
import { toggleSaved } from "@/server/http/actions";
import { currentUser } from "@/server/http/session";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await lessonService.find(id);
  return found ? { title: found.lesson.title, openGraph: { images: [thumbnailUrl(id)] } } : {};
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const found = await lessonService.find(id);
  if (!found) notFound();
  const { lesson, series, related } = found;
  const user = await currentUser();
  const saved = user ? (await savedLessonRepository.listByUser(user.id)).filter((s) => s.lessonId === id).map((s) => s.kind) : [];

  return (
    <div className="wrap watch">
      <iframe
        className="player" title={lesson.title} src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin"
      />
      <h1>{lesson.title}</h1>
      <p className="muted" style={{ marginTop: 10 }}>
        <Link className="link" href={`/aulas?tema=${lesson.category}`}>{categoryBySlug(lesson.category)?.name}</Link>
        {series && <>, série <Link className="link" href={`/aulas?serie=${series.id}`}>{series.title}</Link></>}
      </p>
      <div className="actions">
        {user ? (
          <>
            <SaveButton id={id} kind="favorite" label={saved.includes("favorite") ? "Remover dos favoritos" : "Adicionar aos favoritos"} />
            <SaveButton id={id} kind="watched" label={saved.includes("watched") ? "Desmarcar como assistida" : "Marcar como assistida"} />
          </>
        ) : <Link className="btn ghost" href="/entrar">Entrar para salvar a aula</Link>}
        <a className="btn ghost" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener">Ver no YouTube</a>
      </div>
      {related.length > 0 && <section style={{ marginTop: 72 }}><div className="section-head"><h2>Continue estudando</h2></div><LessonGrid lessons={related} /></section>}
    </div>
  );
}

function SaveButton({ id, kind, label }: { id: string; kind: string; label: string }) {
  return (
    <form action={toggleSaved}>
      <input type="hidden" name="lessonId" value={id} /><input type="hidden" name="kind" value={kind} />
      <button className="btn ghost">{label}</button>
    </form>
  );
}
