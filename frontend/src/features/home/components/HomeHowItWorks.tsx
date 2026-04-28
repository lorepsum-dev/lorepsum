import { howSteps } from "../model/homeContent";

const HomeHowItWorks = () => {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-full py-28">
      <div className="card-glow overflow-hidden rounded-3xl border border-primary-light/15 bg-card/55 p-10 md:p-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary-light/55">
              How it works
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Three simple <span className="text-primary-light">moves.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              No setup, no rules, no shape you have to fit into. Start with one thing, add another
              beside it, and let the connections show you what you're really building.
            </p>
          </div>
          <ol className="space-y-6">
            {howSteps.map((step) => (
              <li key={step.title} className="flex gap-5 border-l border-primary-light/20 pl-6">
                <span className="pt-1 font-mono text-sm text-primary-light">{step.n}</span>
                <div>
                  <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorks;
