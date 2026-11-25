import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";
import { COURSES } from "@/content/courses";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Cursos" };

export default function Courses() {
  return (
    <>
      <PageHead title="Cursos" hebrew="לימוד">Formação com o Rabino Ventura, gravada e ao vivo.</PageHead>
      <section className="section"><div className="wrap"><div className="bento">
        {COURSES.map((c) => (
          <article key={c.slug} className="tile half"><h3>{c.name}</h3><p>{c.text}</p><p>{c.format}</p>
            <span className="inline" style={{ marginTop: "auto" }}><a className="link" href={`${SITE.whatsapp.url}?text=${encodeURIComponent(`Shalom! Quero informações sobre o curso ${c.name}.`)}`} target="_blank" rel="noopener">Inscrever-se por WhatsApp</a><Link className="link" href={`/aulas?tema=${c.category}`}>Aulas abertas</Link></span>
          </article>
        ))}
      </div></div></section>
    </>
  );
}
