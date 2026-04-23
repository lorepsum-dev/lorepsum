import { fetchJson } from "@/lib/api";
import type { Owner } from "../model/types";

interface OwnerResponse {
  owners: Array<{
    id: number;
    name: string;
    bio: string;
    avatar_url: string | null;
    skills: Array<{ name: string; level: string }>;
    socials: Array<{ label: string; value: string }>;
    preferences: Array<{ label: string; value: string }>;
  }>;
}

async function listOwners(): Promise<Owner[]> {
  const data = await fetchJson<OwnerResponse>("/owners");

  return data.owners.map((owner) => ({
    id: owner.id,
    name: owner.name,
    bio: owner.bio,
    avatarUrl: owner.avatar_url,
    skills: owner.skills,
    socials: owner.socials,
    preferences: owner.preferences,
  }));
}

export { listOwners };
