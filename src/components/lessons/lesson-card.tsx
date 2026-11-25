import Image from "next/image";
import Link from "next/link";
import { categoryBySlug, formatDuration, type Lesson, thumbnailUrl } from "@/domain/lesson";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <article className="lesson">
      <Link href={`/aulas/${lesson.id}`}>
        <span className="thumb">
          <Image src={thumbnailUrl(lesson.id)} alt="" width={480} height={360} sizes="(max-width: 620px) 100vw, 300px" unoptimized />
          {lesson.seconds !== null && <span className="time">{formatDuration(lesson.seconds)}</span>}
        </span>
        <h3>{lesson.title}</h3>
      </Link>
      <p className="meta">{categoryBySlug(lesson.category)?.name}{lesson.kind === "live" && ", ao vivo gravado"}</p>
    </article>
  );
}

export function LessonGrid({ lessons }: { lessons: Lesson[] }) {
  return <div className="lesson-grid">{lessons.map((l) => <LessonCard key={l.id} lesson={l} />)}</div>;
}
