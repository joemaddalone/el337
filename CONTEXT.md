# el337

Nx monorepo for a Astro driven site proimarily marrying Youtub video content with articles and code examples. Content is managed via bknd and the static site is deployed to GitHub Pages.

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

**Data model (ContentParts-based):**

|| Entity         | Key fields                                                                                                     ||
|| -------------- | ------------------------------------------------------------------------------------------------------------ ||
|| `pages`        | id, title, description, slug, published, metadata (JSON: SEO + extras like duration)                          ||
|| `content_types`| id, name (e.g., 1='video', 2='article')                                                                    ||
|| `content_parts`| id, contenttypeid, videoid, title, description, thumbnailurl, transcript, file (filename for Article)          ||
|| `pagecontentparts` | pageid, contentpartid, order                                                                              ||

**ContentPartTypes** (defined in `content_types` table):

| Type     | Data Storage | Fields                                                                                      |
| -------- | ------------ | ------------------------------------------------------------------------------------------- |
| Video    | bknd         | youtubeid, title, description, thumbnailurl, transcript                                     |
| Article  | Filesystem   | file (filename of MDX file, e.g., `my-article.mdx`)                                       |

**Pages** have a `metadata` JSON field that includes:
- SEO fields: meta_title, meta_description, og_image, og_type
- Content-specific extras: duration (for Video Pages), etc.

**ContentParts** have their own data:
- Video ContentPart: youtube_id, title, description, thumbnail_url, transcript (stored in bknd)
- Article ContentPart: file (filename of MDX file, e.g., `my-article.mdx`, stored in bknd, content in filesystem)

**PageContentParts** links Pages to ContentParts with an order field. A single ContentPart can be referenced by multiple Pages.

The admin UI at `http://localhost:1337` can be used to create and manage all content. On first boot, follow the [bknd quickstart](https://docs.bknd.io/start/#quickstart) to create an admin user and enable the guard.

### `apps/website` — Static site

Built with [Astro](https://astro.build) (static output), React, and TypeScript. At build time, Astro calls the bknd REST API to generate all pages — bknd must be reachable during the build.

**Pages:**

| Route            | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `/`              | Lists all Pages and their ContentParts                          |
| `/posts/[slug]`  | Page view — assembles ContentParts in order, renders full companion content |

**Data fetching** is handled by `src/lib/api.ts` using the `bknd/client` SDK. Pages fetch their ContentParts and assemble them in order. For Article ContentParts, the Astro build process imports and renders the corresponding MDX file from the filesystem (located in `src/data/[content-part-type]/[file]`).

Set `BKND_HOST` in the build environment to point at your hosted bknd instance.

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

**Reads credentials from env vars — no config arguments needed:**

| Variable                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                               |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                            |
| `BKND_HOST`             | bknd base URL (default: `http://localhost:1337`) |
| `BKND_TOKEN`            | bknd admin JWT                                   |

### Content Loading

During the Astro build process, Pages fetch their ContentParts from bknd and assemble them in order. For Article ContentParts, the Astro build process imports and renders the corresponding MDX file from the filesystem (located in `src/data/[content-part-type]/[file]`).

**File Structure:**
- Video companions: `src/data/video-companions/[filename].mdx`
- Series companions: `src/data/series-companions/[filename].mdx`
- Snippets: `src/data/snippets/[filename].mdx`

**ContentPart data storage:**
- Video ContentPart: data (youtube_id, title, description, thumbnail_url, transcript) stored in bknd
- Article ContentPart: filename (e.g., `my-article.mdx`) stored in bknd, full MDX content in filesystem

Astro caches ContentParts at build time and generates static HTML.

## Nx tasks

```sh
npx nx dev website        # Astro dev server
npx nx build website      # Build static site to apps/website/dist
npx nx dev bknd           # Run bknd CMS
npx nx start bknd         # Same as dev (for production use a proper process manager)
```

## Deployment

The website deploys automatically to **GitHub Pages** on every push to `main` via `.github/workflows/deploy.yml`.

## Glossary

| Term | Definition |
|------|------------|
| Page | A top-level content container (e.g., a video page, series page, or other content page) with its own metadata (title, description, slug, SEO fields) and an ordered list of ContentParts. |
| ContentPart | A building block of content that makes up a Page. Each ContentPart has a type (Video, Article, etc.) and its own data. |
| ContentPartType | The type of a ContentPart (e.g., Video, Article). Determines what data fields are available and where the data is stored. |
| ContentPartData | The data associated with a ContentPart. For "Video" type, data is stored in bknd. For "Article" type, MDX content is stored in the filesystem with a reference in bknd. |
| PageContentPart | A link between a Page and a ContentPart, specifying the ContentPartType, ContentPartId, and Order. |

## Architecture Decision Records

See [docs/adr/0001-mdx-content-in-filesystem.md](./docs/adr/0001-mdx-content-in-filesystem.md) for the decision to store MDX companion content in the filesystem rather than in the bknd database.

See [docs/adr/0002-content-parts-model.md](./docs/adr/0002-content-parts-model.md) for the decision to replace the existing data model with a ContentParts-based system.

Required setup (once):

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Add `BKND_HOST` as a repository secret so the build can reach your hosted bknd instance

The bknd CMS is not deployed by this workflow — host it separately (VPS, Railway, Fly.io, etc.) with a persistent database. For production, point `DB_URL` at a [Turso/LibSQL or PostgreSQL](https://docs.bknd.io/usage/database/) instance instead of the default SQLite file.
