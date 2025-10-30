# Video Projects

**Video content/data storage for all brands and clients**

---

## Purpose

This directory contains **video project data and content** organized by brand and client. Video files themselves are gitignored (see `.gitignore`), but all metadata, configs, scripts, and small assets are version-controlled.

## Structure

Each `v-*` directory represents a brand or client's video projects:

| Directory | Brand/Client | Type | Description |
|-----------|--------------|------|-------------|
| `v-appydave/` | AppyDave | Brand | Primary business (BMAD, Context Engineering) |
| `v-aitldr/` | AITLDR | Brand | AI graphics/animations/storytelling (Mary runs) |
| `v-beauty-and-joy/` | Beauty & Joy | Brand | Joy's personal brand |
| `v-kiros/` | Kiros | Client | Client projects |
| `v-supportsignal/` | SupportSignal | Client | NDIS application client |
| `v-voz/` | VOZ | Client | Creative content (songShine®) |

## Naming Convention

- **Prefix**: `v-` = video projects
- **Name**: Brand or client name (lowercase, hyphens)

## Workflow Types

### FliVideo Workflow (AppyDave - Sequential Recording)

Used for AppyDave brand videos where content is recorded in sequential chapters:

```
v-appydave/b63-remotion-tutorial/
├─ b63-remotion-tutorial.mp4      # Final video (gitignored)
├─ b63-remotion-tutorial.srt      # Transcript (tracked)
├─ b63-remotion-tutorial.txt      # Plain text (tracked)
├─ recordings/                    # Individual recordings
│  ├─ 01-intro.mp4               # (gitignored)
│  ├─ 02-1-content.mp4           # Chapter 2, take 1 (gitignored)
│  ├─ 02-2-content.mp4           # Chapter 2, take 2 (gitignored)
│  └─ 03-outro.mp4               # (gitignored)
├─ assets/                        # Supporting materials (tracked)
│  ├─ design-brief.md
│  └─ thumbnails/
└─ .metadata.json                 # Cross-references (tracked)
```

**Naming Pattern** (from FliVideo docs):
- **Project**: `{sequence}-{project-name}` (e.g., `b63-remotion-tutorial`)
- **Recording**: `{chapter}-{take}-{chapter-name}.mov` (e.g., `02-1-content.mov`)
- **Multi-episode**: `{project}/{episode-num}-{episode-name}/recordings/`

### Storyline App Workflow (VOZ, AITLDR - Script-First)

Used for narrative projects where scripts drive visual generation:

```
v-voz/boy-baker/
├─ data/
│  └─ boy-baker-storyline.json    # Storyline data (tracked)
├─ assets/
│  ├─ original-images/            # Source images (tracked)
│  └─ scene-images/               # Generated scenes (tracked)
├─ docs/
│  └─ visual-storytelling-pipeline.md
└─ .metadata.json
```

## Git Strategy

Each `v-*` directory CAN be its own git repository for:
- ✅ Version control of metadata, configs, scripts
- ✅ Team collaboration (share repo with collaborators)
- ✅ Backup of project structure
- ❌ Large video files (use `.gitignore`)

**Video File Storage**:
- **Active projects**: AWS S3 Standard (~100GB, $2.30/month)
- **Archives**: AWS S3 Glacier (~1TB, $0.99/month)
- **Team sharing**: S3 presigned URLs or CloudBerry Explorer GUI

## Relationship to Code Projects

Video projects often reference code in `/dev/ad/`:

**Example**: Context Engineering AWS video
- **Video project**: `~/dev/video-projects/v-appydave/b64-aws-video-storage/`
- **Code project**: `~/dev/ad/appydave-app-a-day/009-aws-video-storage/`
- **Content pillar**: `~/dev/ad/appydave-brand/content-pillars/07-context-engineering/aws/`
- **Cross-reference**: `.metadata.json` links them together

## Metadata System

Each project can include `.metadata.json` for cross-referencing:

```json
{
  "type": "video-project",
  "brand": "appydave",
  "pillar": "context-engineering/aws",
  "related": {
    "code_projects": ["009-aws-video-storage"],
    "parent_project": "b64-context-engineering",
    "videos": ["b64", "b65"]
  },
  "status": "completed",
  "created": "2025-10-19"
}
```

## Tools That Use This Structure

### FliVideo (Ruby Gem)
- **Location**: `/dev/ad/flivideo/`
- **Purpose**: Video asset management for AppyDave sequential workflow
- **Projects**: `v-appydave/*`

### Storyline App (Node + React)
- **Location**: `/dev/ad/storyline-app/`
- **Purpose**: Narrative-driven visual content creation
- **Projects**: `v-voz/*`, `v-aitldr/*`

### Agent Workflow Builder
- **Location**: Dropbox `/team-awb/` (AWB configs remain in Dropbox for now)
- **Purpose**: Workflow automation configs
- **Note**: May reference projects here via metadata

## Migration Notes

**From `~/videos/`**: AppyDave videos (b40-b63) will gradually migrate to `v-appydave/`

**From `~/dev/clients/voz/projects/`**: VOZ projects moved to `v-voz/`
- `boy-baker/` → `v-voz/boy-baker/`
- `the-point/` → `v-voz/the-point/`
- `appydave-advert/` → `v-aitldr/appydave-advert/`

---

## Quick Reference

**Navigate to video projects**:
```bash
cd ~/dev/video-projects/v-appydave/    # AppyDave brand videos
cd ~/dev/video-projects/v-voz/         # VOZ client projects
```

**Related documentation**:
- `/dev/ad/CLAUDE.md` - Overall ecosystem
- `/dev/ad/flivideo/CLAUDE.md` - FliVideo workflow
- `/dev/ad/storyline-app/CLAUDE.md` - Storyline workflow
- `METADATA-SPEC.md` - Metadata schema (future)

---

**Location**: `/Users/davidcruwys/dev/video-projects/`
**Created**: 2025-10-19
**Purpose**: Unified video project storage across all brands and clients
