import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeConstellation from "./HomeConstellation";
import { EXAMPLE_LORE_PATH, SIGNUP_PATH } from "../model/homeContent";

const HomeHero = () => {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-glow/15 blur-[120px] animate-pulse-glow" />
        <div className="absolute left-[10%] top-[40%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px] animate-drift" />
        <div
          className="absolute right-[8%] top-[20%] h-[260px] w-[260px] rounded-full bg-primary/20 blur-[110px] animate-drift"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary-light) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-light) / 0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
        }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-28 pt-16 text-center md:pt-20">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
            lorepsum
          </h1>
          <p className="mt-4 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        <h2 className="mt-12 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Create anything. <br className="hidden md:block" />
          <span className="text-gradient-purple">Connect everything.</span>
        </h2>

        <p className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Lorepsum is a quiet space to gather what you care about — and see how it all fits
          together. You don't just make things here. You connect them, and explore how everything
          relates.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-md bg-primary-light px-7 font-display text-xs uppercase tracking-[0.28em] text-background shadow-[0_0_32px_hsl(var(--primary-light)/0.25)] hover:bg-primary-light/90"
          >
            <Link to={SIGNUP_PATH}>Create your lore</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-md border-primary-light/25 bg-transparent px-7 font-display text-xs uppercase tracking-[0.28em] text-primary-light hover:bg-primary-light/10 hover:text-primary-light"
          >
            <Link to={EXAMPLE_LORE_PATH}>Explore an example</Link>
          </Button>
        </div>

        <HomeConstellation />
      </div>
    </section>
  );
};

export default HomeHero;
