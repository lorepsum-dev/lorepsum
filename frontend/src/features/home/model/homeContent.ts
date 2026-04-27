import type { LucideIcon } from "lucide-react";
import { BookOpenText, GitFork, LayoutGrid, Network } from "lucide-react";

export const SIGNUP_PATH = "/signup";
export const EXAMPLE_LORE_PATH = "/lores/1";
// TODO: replace with real auth route when implemented
export const SIGNIN_PATH = "/signin";

export type UseCase = {
  tag: string;
  title: string;
  description: string;
};

export const useCases: UseCase[] = [
  {
    tag: "stories",
    title: "Shape your stories",
    description:
      "Follow every thread, every arc, every echo — and see how they weave into one another.",
  },
  {
    tag: "worlds",
    title: "Build your world",
    description:
      "Places, eras, factions, fragments. Bring them into one connected space, structured your way.",
  },
  {
    tag: "characters",
    title: "See who connects to who",
    description:
      "Friendships, rivalries, loyalties, betrayals — understand every relationship at a glance.",
  },
  {
    tag: "ideas",
    title: "Connect your ideas",
    description:
      "Notes and sparks rarely live alone. Link them up and watch something bigger take shape.",
  },
  {
    tag: "music",
    title: "Explore your music your way",
    description:
      "Connect artists, albums, eras and influences. See how the sounds you love fit together.",
  },
  {
    tag: "anything",
    title: "Or something no one else would build",
    description:
      "Whatever you imagine connecting — people, places, moments, obsessions — it belongs here.",
  },
];

export type Lens = {
  key: string;
  name: string;
  tag: string;
  description: string;
  icon: LucideIcon;
};

export const lenses: Lens[] = [
  {
    key: "cards",
    name: "Cards",
    tag: "focus",
    description:
      "Zoom in on one thing at a time. Its details, its image, its place in the bigger picture.",
    icon: LayoutGrid,
  },
  {
    key: "tree",
    name: "Tree",
    tag: "lineage",
    description:
      "Follow how things branch — families, hierarchies, anything that grows from a root.",
    icon: GitFork,
  },
  {
    key: "graph",
    name: "Map",
    tag: "the whole picture",
    description:
      "Step back and see everything at once — the web of links you've quietly been weaving.",
    icon: Network,
  },
  {
    key: "narratives",
    name: "Stories",
    tag: "read it",
    description:
      "Read your world like a book. Stories grouped by theme, weaving through everything you made.",
    icon: BookOpenText,
  },
];

export type HowStep = {
  n: string;
  title: string;
  description: string;
};

export const howSteps: HowStep[] = [
  {
    n: "01",
    title: "Add the pieces",
    description:
      "A character, a place, an album, an idea — anything that belongs in your world.",
  },
  {
    n: "02",
    title: "Connect them",
    description:
      "Draw the links that matter to you. Influences, rivalries, echoes, lineages.",
  },
  {
    n: "03",
    title: "Explore how it all fits",
    description: "Move through it as cards, a map, a tree, or read it like a story.",
  },
];
