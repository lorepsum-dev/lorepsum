import { useCases } from "../model/homeContent";

const HomeWhatYouCanBuild = () => {
  return (
    <section id="what-you-can-build" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="mb-16 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary-light/55">
          What you can connect
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Anything you care about —{" "}
          <span className="text-primary-light">all in one place.</span>
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Lorepsum doesn't care what you bring into it. It only cares how things relate. Whatever
          you gather here becomes part of something connected.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((u, i) => (
          <article
            key={u.title}
            className="group relative overflow-hidden rounded-xl border border-primary-light/10 bg-card/55 p-7 card-glow transition-all duration-300 hover:-translate-y-1 hover:border-primary-light/30"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-glow/0 via-transparent to-primary-glow/0 opacity-0 transition-opacity duration-500 group-hover:from-primary-glow/10 group-hover:to-accent/5 group-hover:opacity-100" />
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary-light/55">
                {u.tag}
              </span>
            </div>
            <h3 className="mb-2 font-display text-xl font-bold">{u.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{u.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomeWhatYouCanBuild;
