import { useQuery } from "@tanstack/react-query";
import { fetchLorePage } from "../api/lores";

function useLorePageData(id: string) {
  return useQuery({
    queryKey: ["lore-page", id],
    queryFn: () => fetchLorePage(id),
    enabled: Boolean(id),
  });
}

export { useLorePageData };
