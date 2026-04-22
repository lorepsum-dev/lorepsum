import type { Entity, Lore, Narrative, Relationship } from "../model/types";

const API_URL = import.meta.env.VITE_API_URL;

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      if (typeof errorData.message === "string") {
        message = errorData.message;
      }
    } catch {
      // Keep the default message when the body is not JSON.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function fetchLore(slug: string): Promise<Lore> {
  const data = await fetchJson<{ lore: Lore }>(`/lores/${slug}`);
  return data.lore;
}

export async function fetchLoreEntities(slug: string): Promise<Entity[]> {
  const data = await fetchJson<{ entities: Entity[] }>(`/lores/${slug}/entities`);
  return data.entities;
}

export async function fetchLoreRelationships(slug: string): Promise<Relationship[]> {
  const data = await fetchJson<{ relationships: Relationship[] }>(`/lores/${slug}/relationships`);
  return data.relationships;
}

export async function fetchLoreNarratives(slug: string): Promise<Narrative[]> {
  const data = await fetchJson<{ narratives: Narrative[] }>(`/lores/${slug}/narratives`);
  return data.narratives;
}

export { ApiError };
