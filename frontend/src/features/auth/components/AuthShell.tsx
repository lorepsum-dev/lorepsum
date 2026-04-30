import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthShellProps {
  eyebrow: string;
  children: ReactNode;
  footer?: ReactNode;
}

function AuthShell({ eyebrow, children, footer }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-[440px]">
        <header className="mb-12 text-center">
          <Link to="/" aria-label="Lorepsum home" className="inline-block">
            <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple">
              lorepsum
            </h1>
          </Link>
          <p className="mt-3 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-primary-light/30" />
          <span className="font-display text-[11px] uppercase tracking-[0.3em] text-primary-light/80">
            {eyebrow}
          </span>
          <span className="h-px w-10 bg-primary-light/30" />
        </div>

        <section>{children}</section>

        {footer && (
          <div className="mt-10 text-center font-mono text-xs tracking-wider text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}

export default AuthShell;
