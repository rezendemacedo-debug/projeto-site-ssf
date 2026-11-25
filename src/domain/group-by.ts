/** Equivale a Map.groupBy, ausente em iPads e Androids mais antigos. */
export function groupBy<T, K>(items: readonly T[], key: (item: T) => K) {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const group = groups.get(k);
    if (group) group.push(item);
    else groups.set(k, [item]);
  }
  return groups;
}
