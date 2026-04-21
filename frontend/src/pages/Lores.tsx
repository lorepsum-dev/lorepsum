import { useQuery } from "@tanstack/react-query";
import LoreCard from "@/components/LoreCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Lore {
  id: number;
  name: string;
  description: string;
}

async function fetchLores(): Promise<Lore[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/lores`);
  const data = await res.json();
  return data.lores;
}

const Index = () => {
  const { data: lores, isLoading } = useQuery({
    queryKey: ["lores"],
    queryFn: fetchLores,
  });

  return (
    <main className="w-full">
      <section className="flex min-h-screen w-full flex-col justify-center px-6 py-16">
        {/* Header */}
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
            lorepsum
          </h1>
          <p className="mt-4 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        {/* Lore's section */}
        <div className="mx-auto mt-16 w-full max-w-5xl">
          {/* Intro */}
          <div className="mb-10 max-w-xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-gradient-purple">Lore's is our archive.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Each lore is a relational data model built around something we love — whatever pulled us in enough to map it. Highly structured, deeply connected.
            </p>
            <p className="mt-4 text-sm text-primary-light/60">Pick a world.</p>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
            <h2 className="font-display text-3xl font-bold uppercase tracking-[0.35em] text-gradient-purple md:text-4xl">
              Lore's
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {isLoading ? (
              <Skeleton className="h-40 w-full rounded-2xl" />
            ) : (
              lores?.filter((lore) => lore.name.toLowerCase() !== "owners").map((lore) => (
                <LoreCard
                  key={lore.id}
                  name={lore.name}
                  description={lore.description}
                  to={`/lores/${lore.name.toLowerCase()}`}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
