import { useQuery } from "@tanstack/react-query";
import { fetchLorePage } from "../api/lores";

function useLorePageData(slug: string) {
  return useQuery({
    queryKey: ["lore-page", slug],
    queryFn: () => fetchLorePage(slug),
    enabled: Boolean(slug),
  });
}

export { useLorePageData };
