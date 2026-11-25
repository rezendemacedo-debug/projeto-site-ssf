import Link from "next/link";
import type { Course } from "@/content/courses";
import { CourseActions } from "./course-actions";

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="bento">
      {courses.map((c) => (
        <article key={c.slug} className="tile">
          <h3><Link href={`/cursos/${c.slug}`}>{c.name}</Link></h3>
          <p>{c.summary}</p>
          <p><strong>{c.format}</strong></p>
          <CourseActions course={c} />
        </article>
      ))}
    </div>
  );
}
