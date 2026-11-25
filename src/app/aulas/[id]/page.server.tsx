import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lessons/lesson-view";
import { thumbnailUrl } from "@/domain/lesson";
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
  const user = await currentUser();
  const saved = user ? (await savedLessonRepository.listByUser(user.id)).filter((s) => s.lessonId === id).map((s) => s.kind) : [];

  return (
    <LessonView found={found}>
        {user ? (
          <>
            <SaveButton id={id} kind="favorite" label={saved.includes("favorite") ? "Remover dos favoritos" : "Adicionar aos favoritos"} />
            <SaveButton id={id} kind="watched" label={saved.includes("watched") ? "Desmarcar como assistida" : "Marcar como assistida"} />
          </>
        ) : <Link className="btn ghost" href="/entrar">Entrar para salvar a aula</Link>}
    </LessonView>
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
