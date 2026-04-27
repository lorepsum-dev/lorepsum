import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem =
  | { kind: "route"; label: string; to: string }
  | { kind: "hash"; label: string; hash: string };

const items: NavItem[] = [
  { kind: "route", label: "Home", to: "/" },
  { kind: "hash", label: "What you can build", hash: "#what-you-can-build" },
  { kind: "hash", label: "How it works", hash: "#how-it-works" },
  { kind: "hash", label: "Explore", hash: "#explore" },
  { kind: "route", label: "Lore's", to: "/lores" },
  { kind: "route", label: "Owners", to: "/owners" },
];

const Nav = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isHome = pathname === "/";
  const visibleItems = isHome ? items : items.filter((item) => item.kind === "route");

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Mobile toggle — the purple line is the button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="fixed left-0 top-0 z-[55] flex h-screen w-5 flex-col items-center justify-center focus:outline-none sm:hidden"
      >
        <div className="h-full w-px bg-gradient-to-b from-transparent via-primary-light/50 to-transparent" />
        <span
          className={cn(
            "absolute text-[10px] text-primary-light transition-all duration-300 drop-shadow-[0_0_8px_hsl(var(--primary-light))]",
            isOpen ? "opacity-0 scale-75" : "opacity-70 scale-100",
          )}
        >
          ✦
        </span>
      </button>

      {/* Blur overlay — mobile only, when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[45] bg-background/40 backdrop-blur-sm sm:hidden"
          onClick={close}
        />
      )}

      {/* Nav panel */}
      <nav
        className={cn(
          "fixed left-6 top-0 z-50 flex h-screen flex-col justify-center transition-all duration-300",
          "sm:translate-x-0 sm:opacity-100",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0",
        )}
      >
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-light/40 to-transparent" />

        <div className="flex flex-col gap-10 pl-5">
          {visibleItems.map((item) => {
            if (item.kind === "route") {
              const active =
                item.to === "/lores"
                  ? pathname === "/lores" || pathname.startsWith("/lores/")
                  : pathname === item.to;
              return (
                <div key={item.to} className="relative flex items-center gap-3">
                  <span
                    className={cn(
                      "absolute -left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm leading-none text-primary-light drop-shadow-[0_0_6px_hsl(var(--primary-light))] transition-opacity duration-500",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  >
                    ✦
                  </span>
                  <Link
                    to={item.to}
                    onClick={close}
                    className={cn(
                      "font-display text-xs uppercase tracking-[0.3em] transition-colors",
                      active
                        ? "text-primary-light"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            }

            return (
              <div key={item.hash} className="relative flex items-center gap-3">
                <a
                  href={item.hash}
                  onClick={close}
                  className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Nav;
