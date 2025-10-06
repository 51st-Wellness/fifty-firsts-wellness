import http from "./http";

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl?: string;
  duration?: number;
  publishedAt?: string;
}

export async function fetchPodcasts(limit?: number): Promise<PodcastEpisode[]> {
  const params: Record<string, any> = {};
  if (limit && limit > 0) params.limit = limit;
  const { data } = await http.get<{ episodes: PodcastEpisode[] }>(`/podcasts`, {
    params,
  });
  return data.episodes;
}

export async function fetchPodcastById(
  id: string
): Promise<PodcastEpisode | undefined> {
  // Backend currently returns list; fetch and find by id client-side
  const episodes = await fetchPodcasts();
  return episodes.find((e) => e.id === id);
}
