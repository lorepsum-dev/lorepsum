import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "@/components/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { listOwners } from "../api/listOwners";
import OwnerDetails from "../components/OwnerDetails";

function OwnersPage() {
  const [expandedOwnerId, setExpandedOwnerId] = useState<number | null>(null);
  const ownersQuery = useQuery({
    queryKey: ["owners"],
    queryFn: listOwners,
  });

  return (
    <main className="w-full">
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-12">
        <header className="mx-auto mb-16 max-w-4xl text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-gradient-purple md:text-7xl">
            lorepsum
          </h1>
          <p className="mb-3 mt-4 font-display text-xs uppercase tracking-[0.5em] text-primary-light/70">
            Playing with lore, building something more.
          </p>
        </header>

        <div className="mx-auto mb-8 flex w-full max-w-5xl items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
          <h2 className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-gradient-purple md:text-3xl">
            Owners
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:items-start">
          {ownersQuery.isLoading ? (
            <Skeleton className="h-[420px] w-full max-w-sm rounded-[1.25rem]" />
          ) : (
            ownersQuery.data?.map((owner) => (
              <div key={owner.id} className="flex w-full max-w-sm flex-col">
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedOwnerId((current) => (current === owner.id ? null : owner.id))}
                >
                  <ProfileCard
                    name={owner.name}
                    bio={owner.bio}
                    initials={owner.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    skills={owner.skills.map((skill) => skill.name)}
                    photo={owner.avatarUrl ?? undefined}
                  />
                </div>
                {expandedOwnerId === owner.id && <OwnerDetails owner={owner} />}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default OwnersPage;
