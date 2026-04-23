interface OwnerLinkItem {
  label: string;
  value: string;
}

interface OwnerSkill {
  name: string;
  level: string;
}

interface Owner {
  id: number;
  name: string;
  bio: string;
  avatarUrl: string | null;
  skills: OwnerSkill[];
  socials: OwnerLinkItem[];
  preferences: OwnerLinkItem[];
}

export type { Owner, OwnerLinkItem, OwnerSkill };
