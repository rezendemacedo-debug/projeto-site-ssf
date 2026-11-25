import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SacredGate } from "@/components/forms/sacred-gate";
import { PageHead } from "@/components/ui/page-head";
import { COURSES } from "@/content/courses";
import { SITE } from "@/content/site";

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
  const whatsapp = `${SITE.whatsapp.url}?text=${encodeURIComponent(`Shalom! Quero informações sobre o curso ${course.name}.`)}`;
  return (
    <>
      <PageHead title={course.name} hebrew={course.hebrew}>{course.summary}</PageHead>
      <section className="section"><div className="wrap cols">
        <div className="stack">
          <h2>{course.format}</h2>
          {course.details.map((d) => <p key={d}>{d}</p>)}
          <SacredGate>
            <div className="actions">
              {course.buyUrl && <a className="btn" href={course.buyUrl} target="_blank" rel="noopener">Comprar no Hotmart</a>}
              <a className={course.buyUrl ? "btn ghost" : "btn"} href={whatsapp} target="_blank" rel="noopener">Falar por WhatsApp</a>
            </div>
          </SacredGate>
          {course.buyUrl && <p className="muted">Valor, parcelamento e pagamento na página oficial de venda.</p>}
          <p><Link className="link" href={`/aulas?tema=${course.category}`}>Aulas abertas sobre o tema</Link></p>
        </div>
        {course.modules.length > 0 && <div><h2>Conteúdo</h2><ol className="rows" style={{ marginTop: 20 }}>{course.modules.map((m, i) => <li key={m}><span>{m}</span><span className="muted">{i + 1}</span></li>)}</ol></div>}
      </div></section>
    </>
  );
}
