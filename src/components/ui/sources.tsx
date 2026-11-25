export function Sources({ items }: { items: readonly string[] }) {
  return (
    <p className="sources">
      Fontes: {items.join("; ")}. Conteúdo introdutório; para decisões práticas consulte um rabino ortodoxo competente.
    </p>
  );
}
