import { Link } from "react-router-dom";

interface LoreCardProps {
  name: string;
  description: string;
  to: string;
}

const LoreCard = ({ name, description, to }: LoreCardProps) => {
  return (
    <Link to={to} className="group relative flex flex-col w-80" style={{ minHeight: "180px" }}>
      <div
        className="relative flex flex-1 flex-col rounded-2xl border border-primary-light/10 p-8 transition-transform duration-500 group-hover:-translate-y-1"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary-glow)/0.08),transparent_70%)]" />
        <div className="relative flex flex-1 flex-col">
          <h3 className="font-display text-2xl uppercase font-bold tracking-[0.3em] text-gradient-purple">
            {name}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default LoreCard;
