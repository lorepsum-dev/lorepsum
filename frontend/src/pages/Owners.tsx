import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Owner {
  id: number;
  name: string;
  bio: string;
  avatar_url: string | null;
  skills: { name: string; level: string }[];
  socials: { label: string; value: string }[];
  preferences: { label: string; value: string }[];
}

async function fetchOwners(): Promise<Owner[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/owners`);
  const data = await res.json();
  return data.owners;
}

const isUrl = (value: string) => value.startsWith("http");
const isEmail = (value: string) => value.includes("@");

const ItemContent = ({ item }: { item: { label: string; value: string } }) => {
  if (isUrl(item.value))
    return (
      <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition hover:text-primary-light">
        {item.label}
      </a>
    );
  if (isEmail(item.value))
    return (
      <a href={`mailto:${item.value}`} className="text-muted-foreground transition hover:text-primary-light">
        {item.label}
      </a>
    );
  return <span className="text-muted-foreground">{item.label}: {item.value}</span>;
};

const SayHiTree = ({ items }: { items: { label: string; value: string }[] }) => (
  <div className="mt-3 w-full font-mono text-base">
    <div
      className="flex items-center gap-2 mb-2 animate-in fade-in duration-300"
      style={{ animationFillMode: "both" }}
    >
      <span className="text-primary-light/30">╰·</span>
      <span className="font-display uppercase tracking-[0.25em] text-primary-light/70">Say Hi</span>
    </div>
    {items.map((s, i) => (
      <div
        key={s.label}
        className="ml-3 flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-left-2 duration-300"
        style={{ animationDelay: `${i * 80 + 80}ms`, animationFillMode: "both" }}
      >
        <span className="text-primary-light/20">{i === items.length - 1 ? "╰·" : "├·"}</span>
        <ItemContent item={s} />
      </div>
    ))}
  </div>
);

const IntoTree = ({ items }: { items: { label: string; value: string }[] }) => (
  <div className="relative w-full font-mono">
    {/* title */}
    <div
      className="relative flex justify-center py-3 animate-in fade-in duration-300"
      style={{ animationFillMode: "both" }}
    >
      <span className="bg-background px-3 font-display text-sm uppercase tracking-[0.25em] text-primary-light/60">
        Into
      </span>
    </div>

    {/* items */}
    {items.map((item, i) => (
      <div
        key={item.label}
        className="relative flex items-center w-full py-2 animate-in fade-in slide-in-from-right-2 duration-300"
        style={{ animationDelay: `${i * 100 + 700}ms`, animationFillMode: "both" }}
      >
        <div className="flex-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary-light/50 shrink-0 z-10 shadow-[0_0_6px_hsl(var(--primary-light))]" />
        <div className="flex-1 flex justify-start pl-4 text-base">
          {isUrl(item.value) ? (
            <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-primary-light/80 transition hover:text-primary-light">
              {item.label}
            </a>
          ) : isEmail(item.value) ? (
            <a href={`mailto:${item.value}`} className="text-primary-light/80 transition hover:text-primary-light">
              {item.label}
            </a>
          ) : (
            <span>
              <span className="text-primary-light/70">{item.label}</span>
              <span className="text-muted-foreground/50">: </span>
              <span className="text-muted-foreground">{item.value}</span>
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Index = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: owners, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: fetchOwners,
  });

  return (
    <main className="w-full">
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-12">
        {/* Header */}
        <header className="mx-auto mb-16 max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
            lorepsum
          </h1>
          <p className="mt-4 font-display mb-3 text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        {/* Owners label */}
        <div className="mx-auto mb-8 flex max-w-5xl w-full items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-gradient-purple md:text-3xl">
            Owners
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
        </div>

        {/* Cards */}
        <div className="mx-auto flex max-w-5xl w-full flex-col items-center justify-center gap-8 md:flex-row md:items-start">
          {isLoading ? (
            <Skeleton className="h-[420px] w-full max-w-sm rounded-[1.25rem]" />
          ) : (
            owners?.map((owner) => (
              <div key={owner.id} className="flex w-full max-w-sm flex-col">
                <div
                  className="cursor-pointer"
                  onClick={() => setExpanded(expanded === owner.id ? null : owner.id)}
                >
                  <ProfileCard
                    name={owner.name}
                    bio={owner.bio}
                    initials={owner.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    skills={owner.skills.map((s) => s.name)}
                    photo={owner.avatar_url ?? undefined}
                  />
                </div>
                {expanded === owner.id && (
                  <div className="relative">
                    {owner.preferences.length > 0 && (
                      <svg
                        aria-hidden
                        className="absolute left-1/2 top-0 h-full -translate-x-1/2 pointer-events-none"
                        width="20"
                        viewBox="0 0 20 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M10,0 L10,100"
                          pathLength="1"
                          stroke="hsl(275 68% 78% / 0.35)"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 1,
                            strokeDashoffset: 1,
                            animation: "drawTrunk 0.8s ease-out forwards",
                          }}
                        />
                      </svg>
                    )}
                    {owner.socials.length > 0 && <SayHiTree items={owner.socials} />}
                    {owner.preferences.length > 0 && <IntoTree items={owner.preferences} />}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Index;
