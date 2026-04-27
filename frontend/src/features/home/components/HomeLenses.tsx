import { lenses } from "../model/homeContent";

const HomeLenses = () => {
  return (
    <section id="explore" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary-light/55">
          Explore
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          One world. <span className="text-primary-light">Many ways to see it.</span>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          The same world looks different depending on how you look at it. Switch the view, and
          something new comes into focus.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lenses.map((l, i) => {
          const Icon = l.icon;
          return (
            <article
              key={l.key}
              className="group relative overflow-hidden rounded-xl border border-primary-light/10 bg-card/55 p-6 card-glow transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/30"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-glow/0 via-transparent to-primary-glow/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-glow/10 group-hover:to-accent/5 group-hover:opacity-100" />
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary-light/55">
                  {l.tag}
                </span>
              </div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-light/20 bg-secondary/50 text-primary-light">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">{l.name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{l.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HomeLenses;
