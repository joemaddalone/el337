# el337

Nx monorepo for a YouTube coding tutorial companion website. Content is managed via bknd and the static site is deployed to GitHub Pages.

## Structure

```
apps/
  website/   — Astro + React + TypeScript static site (@el337/website)
  bknd/      — bknd instance (@el337/bknd)
libs/
  cloudinary/ — shared image upload utility (@el337/cloudinary)
```

## Setup

### 1. Install dependencies

```sh
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```sh
cp .env.example .env
```

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BKND_HOST=http://localhost:1337
BKND_TOKEN=your_bknd_admin_token

# optional — defaults to file:data.db
DB_URL=file:data.db
```

`BKND_TOKEN` is the JWT for an admin user. Generate one by logging into the bknd admin UI after first boot.

### 3. Run locally

```sh
npx nx dev bknd      # CMS at http://localhost:1337
npx nx dev website   # Astro dev server
```

Both can run in parallel in separate terminals.

## Apps

### `apps/bknd` — CMS

Runs a [bknd](https://docs.bknd.io) server in **code-only mode**. Schema is defined in `bknd.config.ts` — changes there are applied on every boot.

**Data model:**

| Entity   | Key fields                                                                                |
| -------- | ----------------------------------------------------------------------------------------- |
| `series` | title, slug, description, youtube_playlist_id                                             |
| `videos` | youtube_id, title, slug, description, transcript, content (markdown), published, position |
| `assets` | label, url — downloadable files attached to videos                                        |
| `links`  | label, url — reference links attached to videos                                           |
| `images` | label, source_url, cloudinary_url, cloudinary_public_id, width, height, alt               |

**Relations:**

- `videos` → `series` (many-to-one via `series_id`)
- `videos` ↔ `assets` (many-to-many)
- `videos` ↔ `links` (many-to-many)
- `videos` ↔ `images` (many-to-many)

The admin UI at `http://localhost:1337` can be used to create and manage all content. On first boot, follow the [bknd quickstart](https://docs.bknd.io/start/#quickstart) to create an admin user and enable the guard.

### `apps/website` — Static site

Built with [Astro](https://astro.build) (static output), React, and TypeScript. At build time, Astro calls the bknd REST API to generate all pages — bknd must be reachable during the build.

**Pages:**

| Route            | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `/`              | Lists all series and standalone videos                          |
| `/videos/[slug]` | Video page — YouTube embed, notes, transcript, downloads, links |
| `/series/[slug]` | Series page — ordered video list, YouTube playlist link         |

**Data fetching** is handled by `src/lib/api.ts` using the `bknd/client` SDK. Set `BKND_HOST` in the build environment to point at your hosted bknd instance.

## Packages

### `packages/cloudinary` — Image upload utility

Shared package for pulling images from any URL, uploading to Cloudinary, and saving a record to bknd.

**Usage:**

```ts
import { uploadFromUrl, attachImageToVideo } from "@el337/cloudinary";

// Upload a YouTube thumbnail and save it to bknd
const image = await uploadFromUrl(
  "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
  {
    label: "My Video Thumbnail",
    alt: "Thumbnail for My Video",
    folder: "thumbnails",
  },
);

// Attach the saved image to a video record
await attachImageToVideo(image.id, videoId);
```

Reads credentials from env vars — no config arguments needed:

| Variable                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                               |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                            |
| `BKND_HOST`             | bknd base URL (default: `http://localhost:1337`) |
| `BKND_TOKEN`            | bknd admin JWT                                   |

## Nx tasks

```sh
npx nx dev website        # Astro dev server
npx nx build website      # Build static site to apps/website/dist
npx nx dev bknd           # Run bknd CMS
npx nx start bknd         # Same as dev (for production use a proper process manager)
```

## Deployment

The website deploys automatically to **GitHub Pages** on every push to `main` via `.github/workflows/deploy.yml`.

Required setup (once):

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Add `BKND_HOST` as a repository secret so the build can reach your hosted bknd instance

The bknd CMS is not deployed by this workflow — host it separately (VPS, Railway, Fly.io, etc.) with a persistent database. For production, point `DB_URL` at a [Turso/LibSQL or PostgreSQL](https://docs.bknd.io/usage/database/) instance instead of the default SQLite file.
