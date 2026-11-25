import Link from "next/link";
import type { Course } from "@/content/courses";

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="bento">
      {courses.map((c) => (
        <Link key={c.slug} href={`/cursos/${c.slug}`} className="tile">
          <h3>{c.name}</h3>
          <p>{c.summary}</p>
          <p><strong>{c.format}</strong></p>
          <span className="link">Ver o curso</span>
        </Link>
      ))}
    </div>
  );
}
