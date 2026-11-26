import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseActions } from "@/components/courses/course-actions";
import { WeeklyPortion } from "@/components/parasha/weekly-portion";
import { PageHead } from "@/components/ui/page-head";
import { COURSES } from "@/content/courses";
import { BUILT_AT } from "@/content/build-info";

type Props = { params: Promise<{ slug: string }> };
const find = async (params: Props["params"]) => {
  const { slug } = await params;
  return COURSES.find((c) => c.slug === slug);
};

export const generateStaticParams = () => COURSES.map(({ slug }) => ({ slug }));
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const course = await find(params);
  return { title: course?.name, description: course?.summary };
};

export default async function CoursePage({ params }: Props) {
  const course = await find(params);
  if (!course) notFound();
  return (
    <>
      <PageHead title={course.name} hebrew={course.hebrew}>{course.summary}</PageHead>
      <section className="section"><div className="wrap cols">
        <div className="stack">
          <h2>{course.format}</h2>
          {course.details.map((d) => <p key={d}>{d}</p>)}
          <CourseActions course={course} />
          {course.buyUrl && <p className="muted">Valor, parcelamento e pagamento na página oficial de venda.</p>}
        </div>
        {course.slug === "parasha-da-semana" && <WeeklyPortion builtAt={BUILT_AT} />}
        {course.modules.length > 0 && <div><h2>Conteúdo</h2><ol className="rows" style={{ marginTop: 20 }}>{course.modules.map((m, i) => <li key={m}><span>{m}</span><span className="muted">{i + 1}</span></li>)}</ol></div>}
      </div></section>
    </>
  );
}
