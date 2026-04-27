import { ApiError, fetchJson } from "@/lib/api";
import { normalizeLorePage } from "../model/normalizeLorePage";
import type { ApiLorePageResponse } from "../model/normalizeLorePage";
import type { LorePageData } from "../model/types";

async function fetchLorePage(id: string): Promise<LorePageData> {
  const data = await fetchJson<ApiLorePageResponse>(`/lores/${id}/page`);
  return normalizeLorePage(data);
}

export { ApiError, fetchLorePage };
