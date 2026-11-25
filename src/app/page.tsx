import Image from "next/image";
import Link from "next/link";
import photo from "@/assets/rabino-ventura.jpg";
import { CourseGrid } from "@/components/courses/course-card";
import { HomeHero } from "@/components/home/home-hero";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { COURSES } from "@/content/courses";
import { LADY_LAW_SOCIAL, SOCIAL } from "@/content/site";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { calendarService, lessonService } from "@/server/container";

export default async function Home() {
  const now = new Date();
  const shabbat = calendarService.shabbat(city, now);
  const parasha = shabbat.parashiot.map((p) => p.name).join(" e ");
  const [overview, own, recent] = await Promise.all([
    lessonService.overview(),
    lessonService.forParasha(shabbat.parashiot, 3),
    lessonService.latest("parasha", 3),
  ]);
  const weekly = own.length > 0 ? own : recent;

  return (
    <>
      <HomeHero builtAt={now.getTime()} />

      <section className="section light">
        <div className="wrap">
          <div className="bento">
            {SHORTCUTS.map((t) => (
              <Link key={t.href} href={t.href} className="tile half">
                <h3>{t.name}</h3><p>{t.text}</p><span className="link">{t.action}</span>
                <span className="glyph" lang="he" aria-hidden="true">{t.glyph}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head"><h2>Cursos do Rabino Ventura</h2><Link href="/cursos" className="link">Todos os cursos</Link></div>
          <CourseGrid courses={COURSES} />
        </div>
      </section>

      <section className="section deep">
        <div className="wrap">
          <div className="section-head">
            <h2>{own.length > 0 ? `Estude a parashá ${parasha}` : "Estude a parashá"}</h2>
            <Link href="/parasha" className="link">Ver a parashá da semana</Link>
          </div>
          <LessonGrid lessons={weekly} />
        </div>
      </section>

      <section className="section light">
        <div className="wrap cols">
          <div className="stack">
            <h2>O movimento</h2>
            <p>O Movimento Sinagoga Sem Fronteiras foi idealizado e fundado pelo Rabino Ventura. É uma organização religiosa não governamental, com um programa pioneiro de resgate, acolhimento, formação judaica, orientação, estudos e amparo religioso dos Bnei Anussim.</p>
            <p>Hoje conta com membros ativos em mais de 30 países.</p>
            <Link href="/bnei-anussim" className="link">Quem são os Bnei Anussim</Link>
          </div>
          <div className="stack">
            <h2>Objetivo</h2>
            <p>Acolher, orientar, instruir, encaminhar e educar, com o suporte e as ferramentas para que os Bnei Anussim possam se reconectar ao povo judeu.</p>
            <p>Aproximar, pelo conhecimento, o povo brasileiro do povo judeu, e fortalecer a comunidade judaica na sociedade brasileira.</p>
            <Link href="/missao" className="link">Missão e pilares</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Image src={photo} alt="Rabino Ventura" sizes="(max-width: 800px) 100vw, 560px" />
          <div className="stack">
            <h2>Rabino Ventura</h2>
            <p className="lead">Rabino-chefe, fundador e idealizador da Sinagoga Sem Fronteiras, com mais de 30 anos de ensino a adultos, jovens e crianças.</p>
            <p>Autor de <cite>Descobrindo a Face Oculta da Torá</cite>, <cite>O Resgate</cite> e outros livros.</p>
            <ul className="rows">{SOCIAL.map((s) => <li key={s.url}><span>{s.name}</span><a className="link" href={s.url} target="_blank" rel="noopener">{s.handle}</a></li>)}</ul>
            <h3 style={{ marginTop: 40 }}>Lady Law</h3>
            <p>Formada em direito pelo Mackenzie, analista e comentarista política, professora de oratória e ativista em defesa de Israel.</p>
            <ul className="rows">{LADY_LAW_SOCIAL.map((s) => <li key={s.url}><span>{s.name}</span><a className="link" href={s.url} target="_blank" rel="noopener">{s.handle}</a></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section deep">
        <div className="wrap">
          <div className="section-head"><h2>{overview.total.toLocaleString("pt-BR")} aulas, por tema</h2><Link href="/aulas" className="link">Abrir o acervo</Link></div>
          <div className="bento">
            {overview.categories.filter((c) => FEATURED[c.slug]).map((c, i) => (
              <Link key={c.slug} href={`/aulas?tema=${c.slug}`} className={`tile${i === 0 || i === 3 ? " wide" : ""}`}>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <span className="link">{c.count} aulas</span>
                <span className="glyph" lang="he" aria-hidden="true">{FEATURED[c.slug]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack">
          <h2>Sinagoga Central</h2>
          <p className="lead">A sinagoga para todos. A SSF é uma organização sem fins lucrativos, com projeto de amparo a pessoas carentes. Sua doação ajuda a construir essa casa.</p>
          <div className="actions"><Link href="/doar" className="btn">Ajude na construção</Link><Link href="/seja-membro" className="btn ghost">Quero ser membro</Link></div>
        </div>
      </section>
    </>
  );
}

const FEATURED: Partial<Record<string, string>> = {
  parasha: "פ", fundamentos: "י", "shabat-e-halacha": "ש", festas: "מ", tefila: "ת", "talmud-e-sabios": "ח",
};

const SHORTCUTS = [
  { href: "/dicionario", name: "Dicionário judaico", text: "As expressões do dia a dia judaico, com grafia hebraica.", action: "Consultar", glyph: "מ" },
  { href: "/judaismo-diario", name: "Judaísmo diário", text: "Shabat, kashrut, tefilá, berachot e mais, com as fontes.", action: "Ler", glyph: "ד" },
  { href: "/biblioteca", name: "Biblioteca", text: "O Tanach completo em hebraico, com Targumim e comentaristas.", action: "Abrir", glyph: "ת" },
  { href: "/hebraico", name: "Aprender hebraico", text: "Letras, vogais, palavras e exercícios.", action: "Começar", glyph: "א" },
];
