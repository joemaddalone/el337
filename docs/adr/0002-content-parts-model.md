# 0002: Replace Existing Data Model with ContentParts System

## Status
Accepted

## Context
The existing bknd data model has entities for `series`, `videos`, `assets`, `links`, and `images` with established relationships. However:
- The existing structure is unused and unproven
- Existing data is irrelevant (will be recreated)
- The current model doesn't support flexible page composition
- The current model doesn't support the vision of a well-organized companion to a YouTube channel with modular content

The user wants a system where:
- Pages are top-level content containers with metadata (title, description, slug, SEO fields)
- Pages are composed of ContentParts (Video, Article, etc.)
- Each ContentPart has its own metadata and data
- ContentParts can be ordered within a Page
- The system supports future expansion (newsletters, paid courses, etc.)

## Decision
Replace the existing data model with a ContentParts-based system:

### New Entities

**Pages**
- id (string)
- title (string)
- description (string)
- slug (string)
- published (boolean)
- metadata (JSON: SEO fields + content-specific extras like duration)

**ContentParts**
- id (string)
- contenttypeid (number) — from `content_types` table
- videoid (string, nullable)
- title (string)
- description (string)
- thumbnailurl (string, nullable)
- transcript (string, nullable)
- file (string, nullable — filename of MDX file for Article type)

**PageContentParts**
- pageid (string)
- contentpartid (string)
- order (integer)

**content_types** (lookup table)
- id (number)
- name (string)

### Data Storage
- Video ContentPart data: stored in bknd (youtube_id, title, description, thumbnail_url, transcript)
- Article ContentPart data: MDX content in filesystem, filename reference in bknd (e.g., `my-article.mdx`)

### Routing
- All Pages follow the same route: `/posts/[slug]`
- Pages are assembled from ContentParts in order during the Astro build process

### Migration Strategy
- No migration from existing data
- Start fresh with new model
- Create new content using the new structure

## Consequences

### Benefits
- Flexible page composition (pages can have any number of ContentParts in any order)
- Clear separation between Page metadata and ContentPart data
- Extensible ContentPartType system (can add new types without changing core structure)
- Supports future expansion (newsletters, paid courses, etc.)
- Each ContentPart has its own metadata and data
- Single ContentPart can be referenced by multiple Pages
- All Pages see updates to a shared ContentPart

### Drawbacks
- More complex data model (three entities instead of two)
- More complex queries (need to join Pages, ContentParts, and PageContentParts)
- No existing data to leverage (must recreate all content)
- More database queries to assemble a page
- Pages silently fail to render if a referenced ContentPart is deleted

### Implementation Notes
- ContentPartType is defined in `content_types` table (id, name)
- ContentPartData varies by type (stored in bknd for Video, filesystem for Article)
- PageContentParts defines the order of ContentParts within a Page
- Pages have a `metadata` JSON field that includes:
  - SEO fields: meta_title, meta_description, og_image, og_type
  - Content-specific extras: duration (for Video Pages), etc.
- ContentParts do NOT have a published status (only Pages do)
- ContentParts are NOT searchable or discoverable (only Pages are)
- ContentParts have NO versioning, permissions, analytics, or localization
- Astro caches ContentParts at build time and generates static HTML

## Related Decisions
- [0001: Store MDX Companion Content in Filesystem](./0001-mdx-content-in-filesystem.md) — Decided to store MDX content in filesystem rather than in bknd, which informs how Article ContentParts store their data.