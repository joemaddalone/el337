import { Api } from "bknd/client";

const api = new Api({
  host: import.meta.env.BKND_HOST ?? "http://localhost:1337",
});

export type Series = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  youtube_playlist_id?: string;
  videos?: Video[];
};

export type Video = {
  id: number;
  youtube_id: string;
  title: string;
  slug: string;
  description?: string;
  transcript?: string;
  content?: string;
  published?: boolean;
  position?: number;
  series_id?: number;
  series?: Series;
  assets?: Asset[];
  links?: Link[];
};

export type Asset = {
  id: number;
  label: string;
  url: string;
};

export type Link = {
  id: number;
  label: string;
  url: string;
};

export async function getAllVideos(): Promise<Video[]> {
  try {
    const { data } = await api.data.readMany("videos", {
      where: { published: 1 },
      sort: "-id",
      with: { series: {}, assets: {}, links: {} },
    });
    return (data ?? []) as Video[];
  } catch {
    return [];
  }
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  try {
    const { data } = await api.data.readOneBy("videos", {
      where: { slug },
      with: { series: {}, assets: {}, links: {} },
    });
    return (data ?? null) as Video | null;
  } catch {
    return null;
  }
}

export async function getAllSeries(): Promise<Series[]> {
  try {
    const { data } = await api.data.readMany("series", {
      with: { videos: {} },
    });
    return (data ?? []) as Series[];
  } catch {
    return [];
  }
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  try {
    const { data } = await api.data.readOneBy("series", {
      where: { slug },
      with: {
        videos: {
          where: { published: 1 },
          sort: "position",
          with: { assets: {}, links: {} },
        },
      },
    });
    return (data ?? null) as Series | null;
  } catch {
    return null;
  }
}
