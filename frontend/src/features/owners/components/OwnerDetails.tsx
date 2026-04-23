import type { Owner, OwnerLinkItem } from "../model/types";

const isUrl = (value: string) => value.startsWith("http");
const isEmail = (value: string) => value.includes("@");

const ItemContent = ({ item }: { item: OwnerLinkItem }) => {
  if (isUrl(item.value)) {
    return (
      <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition hover:text-primary-light">
        {item.label}
      </a>
    );
  }

  if (isEmail(item.value)) {
    return (
      <a href={`mailto:${item.value}`} className="text-muted-foreground transition hover:text-primary-light">
        {item.label}
      </a>
    );
  }

  return <span className="text-muted-foreground">{item.label}: {item.value}</span>;
};

const SayHiTree = ({ items }: { items: OwnerLinkItem[] }) => (
  <div className="mt-3 w-full font-mono text-base">
    <div
      className="mb-2 flex items-center gap-2 animate-in fade-in duration-300"
      style={{ animationFillMode: "both" }}
    >
      <span className="text-primary-light/30">╰·</span>
      <span className="font-display uppercase tracking-[0.25em] text-primary-light/70">Say Hi</span>
    </div>
    {items.map((item, index) => (
      <div
        key={item.label}
        className="ml-3 mt-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
        style={{ animationDelay: `${index * 80 + 80}ms`, animationFillMode: "both" }}
      >
        <span className="text-primary-light/20">{index === items.length - 1 ? "╰·" : "├·"}</span>
        <ItemContent item={item} />
      </div>
    ))}
  </div>
);

const IntoTree = ({ items }: { items: OwnerLinkItem[] }) => (
  <div className="relative w-full font-mono">
    <div
      className="relative flex justify-center py-3 animate-in fade-in duration-300"
      style={{ animationFillMode: "both" }}
    >
      <span className="bg-background px-3 font-display text-sm uppercase tracking-[0.25em] text-primary-light/60">
        Into
      </span>
    </div>

    {items.map((item, index) => (
      <div
        key={item.label}
        className="relative flex w-full items-center py-2 animate-in fade-in slide-in-from-right-2 duration-300"
        style={{ animationDelay: `${index * 100 + 700}ms`, animationFillMode: "both" }}
      >
        <div className="flex-1" />
        <div className="z-10 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light/50 shadow-[0_0_6px_hsl(var(--primary-light))]" />
        <div className="flex flex-1 justify-start pl-4 text-base">
          {isUrl(item.value) ? (
            <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-primary-light/80 transition hover:text-primary-light">
              {item.label}
            </a>
          ) : isEmail(item.value) ? (
            <a href={`mailto:${item.value}`} className="text-primary-light/80 transition hover:text-primary-light">
              {item.label}
            </a>
          ) : (
            <span>
              <span className="text-primary-light/70">{item.label}</span>
              <span className="text-muted-foreground/50">: </span>
              <span className="text-muted-foreground">{item.value}</span>
            </span>
          )}
        </div>
      </div>
    ))}
  </div>
);

function OwnerDetails({ owner }: { owner: Owner }) {
  return (
    <div className="relative">
      {owner.preferences.length > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full -translate-x-1/2"
          width="20"
          viewBox="0 0 20 100"
          preserveAspectRatio="none"
        >
          <path
            d="M10,0 L10,100"
            pathLength="1"
            stroke="hsl(275 68% 78% / 0.35)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: "drawTrunk 0.8s ease-out forwards",
            }}
          />
        </svg>
      )}
      {owner.socials.length > 0 && <SayHiTree items={owner.socials} />}
      {owner.preferences.length > 0 && <IntoTree items={owner.preferences} />}
    </div>
  );
}

export default OwnerDetails;
