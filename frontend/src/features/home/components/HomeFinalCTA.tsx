import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EXAMPLE_LORE_PATH, SIGNUP_PATH } from "../model/homeContent";

const HomeFinalCTA = () => {
  return (
    <section className="relative mx-auto max-w-4xl py-32 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 w-72 -translate-y-1/2 rounded-full bg-primary-glow/15 blur-[120px]"
      />
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary-light/55">Begin</p>
      <h2 className="mt-4 text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
        Everything you make, <br />
        <span className="text-gradient-purple">finally connected.</span>
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        One thing. One link between two things. That's where every world begins.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
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
    </section>
  );
};

export default HomeFinalCTA;
