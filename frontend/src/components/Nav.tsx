import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  section?: string;
  route?: string;
};

const items: NavItem[] = [
  { label: "Home", section: "home", route: "/" },
  { label: "What you can build", section: "what-you-can-build" },
  { label: "How it works", section: "how-it-works" },
  { label: "Explore", section: "explore" },
  { label: "Lore's", route: "/lores" },
  { label: "Owners", route: "/owners" },
];

const HOME_SECTION_IDS = ["home", "what-you-can-build", "how-it-works", "explore"];

const Nav = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    setActiveSection("home");

    const elements = HOME_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const visibleItems = isHome ? items : items.filter((item) => item.route);

  const isItemActive = (item: NavItem): boolean => {
    if (isHome && item.section) {
      return item.section === activeSection;
    }
    if (item.route === "/lores") {
      return pathname === "/lores" || pathname.startsWith("/lores/");
    }
    return item.route === pathname;
  };

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
            const useSection = isHome && item.section;
            const active = isItemActive(item);

            return (
              <div key={item.label} className="relative flex items-center gap-3">
                <span
                  className={cn(
                    "absolute -left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm leading-none text-primary-light drop-shadow-[0_0_6px_hsl(var(--primary-light))] transition-opacity duration-500",
                    active ? "opacity-100" : "opacity-0",
                  )}
                >
                  ✦
                </span>
                {useSection ? (
                  <a
                    href={`#${item.section}`}
                    onClick={() => {
                      if (item.section) setActiveSection(item.section);
                      close();
                    }}
                    className={cn(
                      "font-display text-xs uppercase tracking-[0.3em] transition-colors",
                      active
                        ? "text-primary-light"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.route!}
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
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Nav;
