import { useQuery } from "@tanstack/react-query";
import {
  fetchLore,
  fetchLoreEntities,
  fetchLoreNarratives,
  fetchLoreRelationships,
} from "../api/lores";

export function useLorePage(slug: string) {
  const loreQuery = useQuery({
    queryKey: ["lore", slug],
    queryFn: () => fetchLore(slug),
  });

  const entitiesQuery = useQuery({
    queryKey: ["lore", slug, "entities"],
    queryFn: () => fetchLoreEntities(slug),
    enabled: loreQuery.isSuccess,
  });

  const relationshipsQuery = useQuery({
    queryKey: ["lore", slug, "relationships"],
    queryFn: () => fetchLoreRelationships(slug),
    enabled: loreQuery.isSuccess,
  });

  const narrativesQuery = useQuery({
    queryKey: ["lore", slug, "narratives"],
    queryFn: () => fetchLoreNarratives(slug),
    enabled: loreQuery.isSuccess,
  });

  return {
    loreQuery,
    entitiesQuery,
    relationshipsQuery,
    narrativesQuery,
    isLoading:
      loreQuery.isLoading ||
      entitiesQuery.isLoading ||
      relationshipsQuery.isLoading ||
      narrativesQuery.isLoading,
  };
}
