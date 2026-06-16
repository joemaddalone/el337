# 0001: Store MDX Companion Content in Filesystem

## Status
Accepted

## Context
The el337 project aims to be a well-organized companion to a YouTube channel, providing:
- Video metadata and transcripts in a database (bknd)
- Companion articles/tutorials in MDX format
- Course/series organization with similar split approach

Initially, companion content was stored directly in the `content` field of video and series entities in bknd as markdown. However, this approach has limitations:
- MDX requires build-time compilation, not runtime rendering from database
- Storing JSX/MDX as text in database creates complexity for processing
- Limits the ability to use MDX features like custom components, imports, and expressions
- Separation of concerns: metadata/transcript belong in database, rich content belongs in filesystem

## Decision
Store video and series companion content as MDX files in the filesystem, with bknd storing only a reference (typically the slug) to locate the corresponding file.

### Changes to Data Model
- `series.content`: Reference to series companion MDX file (was: description only)
- `videos.content`: Reference to video companion MDX file (was: markdown content)

### File Structure
- Video companions: `apps/website/src/data/video-companions/[slug].mdx`
- Series companions: `apps/website/src/data/series-companions/[slug].mdx`

### Implementation
During the Astro build process:
1. Pages fetch data from bknd as usual
2. The `content` field provides the reference to the MDX file
3. Pages import and render the corresponding MDX file to display full companion content
4. Metadata (title, description, transcript, etc.) continues to come from bknd

## Consequences
### Benefits
- Enables full MDX features (JSX, imports, custom components, etc.)
- Build-time processing ensures optimal performance
- Clear separation: database for structured data, filesystem for rich content
- Leverages Astro's native MDX support
- Content can be edited with standard MDX tooling

### Drawbacks
- Requires updating existing content from database fields to files
- Build process becomes more complex (needs to import MDX files)
- Content is no longer directly editable via bknd admin UI
- Need to ensure file naming convention matches bknd references

### Migration Plan
1. Create filesystem directories for video and series companions
2. Export existing content from bknd `content` fields to corresponding MDX files
3. Update bknd records to store the slug/reference instead of full content
4. Update Astro pages to load and render MDX files based on the reference
5. Verify all existing content renders correctly

## Related Decisions
- None yet (this is the first architectural decision recorded)
