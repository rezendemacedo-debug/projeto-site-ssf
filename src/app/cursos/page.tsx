import type { Metadata } from "next";
import { CourseGrid } from "@/components/courses/course-card";
import { PageHead } from "@/components/ui/page-head";
import { COURSES } from "@/content/courses";

export const metadata: Metadata = { title: "Cursos", description: "Cursos do Rabino Ventura: introdução ao judaísmo, hebraico, festas, Sábios, parashá e tradições." };

export default function Courses() {
  return (
    <>
      <PageHead title="Cursos" hebrew="לימוד">Formação judaica com o Rabino Ventura, em cursos gravados e aulas ao vivo.</PageHead>
      <section className="section"><div className="wrap"><CourseGrid courses={COURSES} /></div></section>
    </>
  );
}
