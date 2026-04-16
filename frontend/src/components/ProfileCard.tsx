import { User } from "lucide-react";

interface ProfileCardProps {
  name: string;
  bio: string;
  skills: string[];
  photoUrl?: string;
}

export function ProfileCard({ name, bio, skills, photoUrl }: ProfileCardProps) {
  return (
    <div className="group relative w-full max-w-sm">
      {/* Outer glow */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary opacity-60 blur-md transition duration-500 group-hover:opacity-90" />

      <article className="relative flex flex-col rounded-2xl border border-border bg-card/90 p-6 backdrop-blur-sm card-glow-soft transition duration-500 group-hover:card-glow">
        {/* Frame header */}
        <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-accent">
            Lore Card
          </span>
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
        </div>

        {/* Photo */}
        <div className="relative mx-auto mb-5 h-40 w-40 overflow-hidden rounded-xl border-2 border-primary/60 bg-gradient-to-br from-primary/30 to-accent/20">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-16 w-16 text-accent/70" strokeWidth={1.2} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
        </div>

        {/* Name */}
        <h3 className="text-center font-display text-2xl font-semibold text-gradient-mystic">
          {name}
        </h3>

        {/* Bio */}
        <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{bio}</p>

        {/* Skills */}
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="mb-3 font-display text-[10px] uppercase tracking-[0.3em] text-accent/80">
            Skills
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-primary/50 bg-primary/20 px-3 py-1 text-xs font-medium text-foreground/90 backdrop-blur-sm transition hover:border-accent hover:bg-accent/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
