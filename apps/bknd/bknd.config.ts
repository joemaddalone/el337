import { type BkndConfig, em, entity, text, number, boolean } from "bknd";

const schema = em({
  series: entity("series", {
    title: text().required(),
    slug: text().required(),
    description: text(),
    youtube_playlist_id: text(),
  }),

  videos: entity("videos", {
    youtube_id: text().required(),
    title: text().required(),
    slug: text().required(),
    description: text(),
    transcript: text(),
    content: text(), // markdown
    published: boolean(),
    position: number(), // order within a series (null = standalone)
  }),

  assets: entity("assets", {
    label: text().required(),
    url: text().required(),
  }),

  links: entity("links", {
    label: text().required(),
    url: text().required(),
  }),

  images: entity("images", {
    label: text().required(),
    source_url: text().required(), // original URL the image was pulled from
    cloudinary_url: text().required(), // delivered Cloudinary URL
    cloudinary_public_id: text().required(),
    width: number(),
    height: number(),
    alt: text(),
  }),
});

export default {
  connection: {
    url: process.env.DB_URL ?? "file:data.db",
  },
  config: {
    data: {
      ...schema.toJSON(),
      relations: {
        videos_series: {
          type: "n:1",
          source: "videos",
          target: "series",
        },
        videos_assets: {
          type: "m:n",
          source: "videos",
          target: "assets",
        },
        videos_links: {
          type: "m:n",
          source: "videos",
          target: "links",
        },
        videos_images: {
          type: "m:n",
          source: "videos",
          target: "images",
        },
      },
    },
  },
  options: {
    mode: "code",
  },
} satisfies BkndConfig;
