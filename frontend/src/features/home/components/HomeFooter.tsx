const HomeFooter = () => {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground/70 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
          <span>lorepsum — playing with lore, building something more</span>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
