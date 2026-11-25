import Link from "next/link";
import { SkyHero } from "@/components/home/sky-hero";
import { LessonGrid } from "@/components/lessons/lesson-card";
import { time } from "@/components/ui/format";
import { DEFAULT_CITY as city } from "@/domain/cities";
import { skyPhase } from "@/domain/sky";
import { calendarService, lessonService } from "@/server/container";

export default async function Home() {
  const now = new Date();
  const z = calendarService.zmanim(city, now);
  const shabbat = calendarService.shabbat(city, now);
  const date = calendarService.hebrewDateText(city, now);
  const omer = calendarService.omer(city, now);
  const times = { alot: +z.alot, netz: +z.netz, plag: +z.plag, shkia: +z.shkia, tzeit: +z.tzeit };
  const parasha = shabbat.parashiot.map((p) => p.name).join(" e ");
  const [overview, own, recent] = await Promise.all([
    lessonService.overview(),
    lessonService.forParasha(shabbat.parashiot, 3),
    lessonService.latest("parasha", 3),
  ]);
  const weekly = own.length > 0 ? own : recent;

  return (
    <>
      <SkyHero times={times} initial={skyPhase(times, +now)}>
        <div className="wrap sky-content">
          <p className="he" lang="he" dir="rtl" style={{ textAlign: "left" }}>{date.hebrew}</p>
          <h1>Torá sem fronteiras.</h1>
          <p className="lead">Aulas do Rabino Ventura, textos sagrados, hebraico e os horários do seu dia judaico.</p>
          <div className="actions">
            <Link href="/aulas" className="btn">Assistir às aulas</Link>
            <Link href="/parasha" className="btn ghost">Parashá {parasha}</Link>
          </div>
        </div>
        <div className="sky-facts">
          <div className="wrap">
            <dl>
              <div><dt>Hoje</dt><dd>{date.latin}</dd></div>
              {omer ? <div><dt>Ômer</dt><dd>{omer.day}º dia</dd></div> : <div><dt>Pôr do sol, {city.name}</dt><dd>{time(z.shkia, city.tz)}</dd></div>}
              <div><dt>Velas de Shabat</dt><dd>{time(shabbat.candles, city.tz)}</dd></div>
              <div><dt>Havdalá</dt><dd>{time(shabbat.havdalah, city.tz)}</dd></div>
            </dl>
          </div>
        </div>
      </SkyHero>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>{own.length > 0 ? `Estude a parashá ${parasha}` : "Estude a parashá"}</h2>
            <Link href="/parasha" className="link">Ver a parashá da semana</Link>
          </div>
          <LessonGrid lessons={weekly} />
        </div>
      </section>

      <section className="section light">
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

      <section className="section deep">
        <div className="wrap">
          <div className="section-head"><h2>Aprenda no seu ritmo</h2></div>
          <div className="bento">
            <Link href="/hebraico" className="tile half"><h3>Do alef ao tav</h3><p>Letras, vogais, palavras e exercícios para começar a ler o sidur.</p><span className="link">Aprender hebraico</span><span className="glyph" lang="he" aria-hidden="true">א</span></Link>
            <Link href="/biblioteca" className="tile half"><h3>Biblioteca sagrada</h3><p>Tanach, Mishná e Halachá no original.</p><span className="link">Abrir a biblioteca</span><span className="glyph" lang="he" aria-hidden="true">ת</span></Link>
            <Link href="/calendario" className="tile half"><h3>Luach e zmanim</h3><p>Calendário judaico, velas, havdalá e horários da sua cidade.</p><span className="link">Ver o calendário</span><span className="glyph" lang="he" aria-hidden="true">ל</span></Link>
            <Link href="/bnei-anussim" className="tile half"><h3>Bnei Anussim</h3><p>A memória judaica escondida na história do Brasil.</p><span className="link">Conhecer a história</span><span className="glyph" lang="he" aria-hidden="true">ז</span></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="stack">
            <h2>Uma casa para quem busca</h2>
            <p className="lead">A Sinagoga Sem Fronteiras foi fundada pelo Rabino Ventura para acolher, orientar e ensinar, com membros em mais de 30 países.</p>
            <div className="actions"><Link href="/sobre" className="btn">Conhecer a sinagoga</Link><Link href="/seja-membro" className="btn ghost">Seja membro</Link></div>
          </div>
          <blockquote className="page-text" lang="he">כִּי בֵיתִי בֵּית־תְּפִלָּה יִקָּרֵא לְכׇל־הָעַמִּים<p className="muted" lang="pt-BR" dir="ltr" style={{ fontSize: "1rem", lineHeight: 1.5 }}>“Pois Minha casa será chamada casa de oração para todos os povos.” Yeshayahu 56:7</p></blockquote>
        </div>
      </section>
    </>
  );
}

const FEATURED: Partial<Record<string, string>> = {
  parasha: "פ", fundamentos: "י", "shabat-e-halacha": "ש", festas: "מ", tefila: "ת", "talmud-e-sabios": "ח",
};
