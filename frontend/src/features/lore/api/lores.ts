import { ApiError, fetchJson } from "@/lib/api";
import { normalizeLorePage } from "../model/normalizeLorePage";
import type { ApiLorePageResponse } from "../model/normalizeLorePage";
import type { LorePageData } from "../model/types";

async function fetchLorePage(slug: string): Promise<LorePageData> {
  const data = await fetchJson<ApiLorePageResponse>(`/lores/${slug}/page`);
  return normalizeLorePage(data);
}

export { ApiError, fetchLorePage };
