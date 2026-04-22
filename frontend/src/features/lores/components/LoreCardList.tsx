import LoreCard from "@/components/LoreCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { LoreListItem } from "../api/listLores";

interface LoreCardListProps {
  lores?: LoreListItem[];
  isLoading: boolean;
}

const LoreCardList = ({ lores, isLoading }: LoreCardListProps) => {
  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-2xl" />;
  }

  return (
    <>
      {lores
        ?.filter((lore) => lore.slug !== "owners")
        .map((lore) => (
          <LoreCard
            key={lore.id}
            name={lore.name}
            description={lore.description}
            to={`/lores/${lore.slug}`}
          />
        ))}
    </>
  );
};

export default LoreCardList;
