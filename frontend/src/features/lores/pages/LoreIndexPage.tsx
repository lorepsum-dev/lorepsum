import { useQuery } from "@tanstack/react-query";
import LoreCardList from "../components/LoreCardList";
import { listLores } from "../api/listLores";

const LoreIndexPage = () => {
  const { data: lores, isLoading } = useQuery({
    queryKey: ["lores"],
    queryFn: listLores,
  });

  return (
    <main className="w-full">
      <section className="flex min-h-screen w-full flex-col justify-center px-6 py-16">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
            lorepsum
          </h1>
          <p className="mt-4 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        <div className="mx-auto mt-16 w-full max-w-5xl">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="font-display text-2xl font-bold text-gradient-purple">
              Lore&apos;s is our archive.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Each lore is a relational data model built around something we love
              {" "}— whatever pulled us in enough to map it. Highly structured, deeply connected.
            </p>
            <p className="mt-4 text-sm text-primary-light/60">Pick a world.</p>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
            <h2 className="font-display text-3xl font-bold uppercase tracking-[0.35em] text-gradient-purple md:text-4xl">
              Lore&apos;s
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <LoreCardList lores={lores} isLoading={isLoading} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoreIndexPage;
