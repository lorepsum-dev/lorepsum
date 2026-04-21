import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", to: "/" },
  { label: "Builds", to: "/builds" },
  { label: "Lab", to: "/lab" },
  { label: "Lore's", to: "/lores" },
  { label: "Owners", to: "/owners" },
];

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed left-6 top-0 z-50 flex h-screen flex-col justify-center">
      {/* linha roxa */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-light/40 to-transparent" />

      <div className="flex flex-col gap-10 pl-5">
        {links.map((link) => {
          const active = link.to === "/lores"
            ? pathname === "/lores" || pathname.startsWith("/lores/")
            : pathname === link.to;
          return (
            <div key={link.to} className="relative flex items-center gap-3">
              <span className={cn(
                "absolute -left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-light text-sm leading-none drop-shadow-[0_0_6px_hsl(var(--primary-light))] transition-opacity duration-500",
                active ? "opacity-100" : "opacity-0"
              )}>
                ✦
              </span>
              <Link
                to={link.to}
                className={cn(
                  "font-display text-xs uppercase tracking-[0.3em] transition-colors",
                  active ? "text-primary-light" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Nav;
