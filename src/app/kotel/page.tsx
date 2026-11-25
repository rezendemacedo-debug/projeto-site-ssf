import type { Metadata } from "next";
import { KotelView } from "@/components/kotel/kotel-view";

export const metadata: Metadata = { title: "Kotel ao vivo", description: "Câmeras ao vivo do Kotel, em Jerusalém." };

export default function Kotel() {
  return <KotelView builtAt={Date.now()} />;
}
