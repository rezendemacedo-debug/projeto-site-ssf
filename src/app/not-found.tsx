import Link from "next/link";
import { PageHead } from "@/components/ui/page-head";

export default function NotFound() {
  return <><PageHead title="Página não encontrada">O endereço pode ter mudado.</PageHead><div className="wrap" style={{ paddingBottom: 120 }}><Link className="btn" href="/">Ir para o início</Link></div></>;
}
