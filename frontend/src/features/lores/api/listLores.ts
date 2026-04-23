import { fetchJson } from "@/lib/api";

interface LoreListItem {
  id: number;
  name: string;
  description: string;
  slug: string;
}

async function listLores(): Promise<LoreListItem[]> {
  const data = await fetchJson<{ lores: LoreListItem[] }>("/lores");
  return data.lores;
}

export { listLores };
export type { LoreListItem };
