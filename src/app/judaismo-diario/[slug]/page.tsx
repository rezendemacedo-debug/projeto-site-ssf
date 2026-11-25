import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/ui/page-head";
import { Sources } from "@/components/ui/sources";
import { DAILY } from "@/content/daily";

type Props = { params: Promise<{ slug: string }> };
const find = async (params: Props["params"]) => {
  const { slug } = await params;
  return DAILY.find((a) => a.slug === slug);
};

export const generateStaticParams = () => DAILY.map(({ slug }) => ({ slug }));
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => ({ title: (await find(params))?.title });

export default async function ArticlePage({ params }: Props) {
  const a = await find(params);
  if (!a) notFound();
  return (
    <>
      <PageHead title={a.title} hebrew={a.hebrew}>{a.summary}</PageHead>
      <article className="wrap narrow stack" style={{ paddingBottom: 96, fontSize: "1.15rem" }}>{a.body.map((p) => <p key={p}>{p}</p>)}<Sources items={a.sources} /></article>
    </>
  );
}
