import { createFileRoute } from "@tanstack/react-router";
import { ProfileCard } from "@/components/ProfileCard";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const profiles = [
  {
    name: "Aerith Vale",
    bio: "Wanderer of codebases, weaver of interfaces. Keeper of arcane stack traces.",
    skills: ["TypeScript", "React", "Node.js", "GraphQL", "Figma"],
  },
  {
    name: "Kaelen Drex",
    bio: "Forger of pipelines, summoner of containers. Whispers fluently in shell.",
    skills: ["Python", "Go", "Docker", "Kubernetes", "PostgreSQL"],
  },
];

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Mythological Profiles
            </span>
          </div>
          <h1 className="font-display text-6xl font-bold tracking-tight text-gradient-mystic md:text-7xl">
            Lorepsum
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Two souls, infinite skills. Cards forged in the violet flame.
          </p>
        </header>

        {/* Owners */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.2em] text-gradient-mystic md:text-4xl">
              Owners
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:items-stretch md:gap-8">
            {profiles.map((p) => (
              <ProfileCard key={p.name} {...p} />
            ))}
          </div>
        </section>

        {/* LORE's section */}
        <section className="mt-24">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.2em] text-gradient-mystic md:text-4xl">
              LORE's
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="relative min-h-[260px] rounded-2xl border border-dashed border-border bg-card/30 p-10 backdrop-blur-sm">
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
              <Sparkles className="mb-3 h-8 w-8 text-accent/50" />
              <p className="font-display text-sm uppercase tracking-[0.25em] text-muted-foreground">
                The chronicles await
              </p>
              <p className="mt-2 max-w-md text-xs text-muted-foreground/70">
                This sacred space will soon hold the legends and tales.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
