"use client";

import Link from "next/link";
import { useSacredTime } from "@/components/ui/use-sacred-time";
import type { Course } from "@/content/courses";
import { SITE } from "@/content/site";

export function CourseActions({ course }: { course: Pick<Course, "name" | "buyUrl" | "category"> }) {
  const sacred = useSacredTime();
  const whatsapp = `${SITE.whatsapp.url}?text=${encodeURIComponent(`Shalom! Quero informações sobre o curso ${course.name}.`)}`;
  return (
    <div className="actions tight">
      {sacred === false && course.buyUrl && <a className="btn gold small" href={course.buyUrl} target="_blank" rel="noopener">Comprar</a>}
      {sacred === false && <a className={`btn small${course.buyUrl ? " ghost" : " gold"}`} href={whatsapp} target="_blank" rel="noopener">WhatsApp</a>}
      <Link className="btn small" href={`/aulas?tema=${course.category}`}>Aulas abertas sobre o tema</Link>
    </div>
  );
}
