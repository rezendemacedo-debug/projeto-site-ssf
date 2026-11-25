import Link from "next/link";
import type { ReactNode } from "react";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { categoryBySlug } from "@/domain/lesson";
import type { LessonService } from "@/server/services/lesson-service";

type Found = NonNullable<Awaited<ReturnType<LessonService["find"]>>>;

export function LessonView({ found: { lesson, series, related }, children }: { found: Found; children?: ReactNode }) {
  return (
    <div className="wrap watch">
      <iframe
        className="player" title={lesson.title} src={`https://www.youtube-nocookie.com/embed/${lesson.id}?rel=0`}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin"
      />
      <h1>{lesson.title}</h1>
      <p className="muted" style={{ marginTop: 10 }}>
        <Link className="link" href={`/aulas?tema=${lesson.category}`}>{categoryBySlug(lesson.category)?.name}</Link>
        {series && <>, série <Link className="link" href={`/aulas?serie=${series.id}`}>{series.title}</Link></>}
      </p>
      <div className="actions">
        {children}
        <a className="btn ghost" href={`https://www.youtube.com/watch?v=${lesson.id}`} target="_blank" rel="noopener">Ver no YouTube</a>
      </div>
      {related.length > 0 && <section style={{ marginTop: 72 }}><div className="section-head"><h2>Continue estudando</h2></div><LessonGrid lessons={related} /></section>}
    </div>
  );
}
