interface LoreListItem {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export async function listLores(): Promise<LoreListItem[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/lores`);
  const data = await response.json();
  return data.lores;
}

export type { LoreListItem };
