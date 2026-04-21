interface ProfileCardProps {
  name: string;
  bio: string;
  skills: string[];
  photo?: string;
  initials: string;
  accent?: string;
}

const ProfileCard = ({ name, bio, skills, photo, initials, accent = "Mage" }: ProfileCardProps) => {
  return (
    <div className="group relative flex w-full max-w-sm flex-col" style={{ minHeight: "420px" }}>
      <div className="absolute -inset-px rounded-[1.25rem] border-primary-light/12 opacity-80 transition duration-500 group-hover:opacity-100" />

      <div
        className="relative flex flex-1 flex-col rounded-[1.25rem] border border-primary-light/10 p-5 card-glow transition-transform duration-500 group-hover:-translate-y-1"
        style={{ background: "var(--gradient-card)" }}
      >
        {/* Top label */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-primary-light/80">
            {accent}
          </span>
          <span className="rounded-full border border-primary-light/30 bg-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-light">
            Lv. ∞
          </span>
        </div>

        {/* Photo frame */}
        <div className="relative mx-auto mb-5 aspect-square w-full overflow-hidden rounded-xl border border-primary-light/12 bg-secondary/60">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 via-transparent to-accent/20" />
          {photo ? (
            <img src={photo} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-6xl text-gradient-purple">{initials}</span>
            </div>
          )}
          {/* shimmer */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-glow)/0.12),transparent_60%)]" />
        </div>

        {/* Name + bio */}
        <div className="mb-4 text-center">
          <h3 className="font-display text-2xl font-semibold text-foreground">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{bio}</p>
        </div>

        {/* Divider */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent" />
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-primary-light/60">
            Skills
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent" />
        </div>

        {/* Skills */}
        <div className="flex flex-1 flex-wrap justify-center gap-1.5 content-start">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-primary-light/18 bg-primary/14 px-2.5 py-1 text-xs font-medium text-primary-light shadow-[0_0_8px_hsl(var(--primary-glow)/0.08)] transition hover:bg-primary/22 hover:text-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
