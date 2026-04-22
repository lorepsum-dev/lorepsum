interface LoreHeaderProps {
  title: string;
  description?: string | null;
}

const LoreHeader = ({ title, description }: LoreHeaderProps) => {
  return (
    <>
      <header className="mx-auto mb-16 max-w-4xl text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
          lorepsum
        </h1>
        <p className="mt-4 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
          Playing with lore, building something more.
        </p>
      </header>

      <div className="mb-2 flex w-full max-w-5xl items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-gradient-purple">
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
      </div>

      {description && (
        <p className="mt-3 mb-6 max-w-xl text-center font-mono text-xs leading-relaxed text-muted-foreground/50">
          {description}
        </p>
      )}
    </>
  );
};

export default LoreHeader;
