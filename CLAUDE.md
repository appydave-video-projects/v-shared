# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Table of Contents

- [Repository Overview](#repository-overview)
- [Directory Structure](#directory-structure)
- [v-shared Specific Directories](#v-shared-specific-directories)
  - [project-notes/](#project-notes) - David ↔ Jan task communication
  - [ai-model-research/](#ai-model-research) - AI tool research & recommendations
- [Two Workflow Patterns](#two-workflow-patterns)
  - [FliVideo Workflow (AppyDave)](#pattern-a-flivideo-workflow-appydave)
  - [Storyline Workflow (VOZ, AITLDR)](#pattern-b-storyline-workflow-voz-aitldr)
- [Final Assets Directory](#final-assets-directory)
- [Git Strategy](#git-strategy)
- [Related Tools & Projects](#related-tools--projects)
- [Common Tasks](#common-tasks)

---

## Repository Overview

This is a **unified video project storage repository** for all brands and clients in David Cruwys's ecosystem. Video files themselves are gitignored (stored on AWS S3 or T7 drive), while metadata, transcripts, configs, and documentation are version-controlled.

**GitHub Organization**: https://github.com/appydave-video-projects

**Repositories**:
- [v-appydave](https://github.com/appydave-video-projects/v-appydave) - AppyDave brand (147 files, 137MB)
- [v-voz](https://github.com/appydave-video-projects/v-voz) - VOZ client (327 files, 930MB)
- [v-aitldr](https://github.com/appydave-video-projects/v-aitldr) - AITLDR brand (25 files)

**Key Concept**: This repository uses two distinct workflows depending on the video type:
1. **FliVideo Workflow** - Sequential chapter-based recording (AppyDave brand videos)
2. **Storyline Workflow** - Script-first narrative-driven content (VOZ, AITLDR)

**Security**: Secret scanning enabled - see `SECURITY-SETUP.md` for protection against API keys/credentials

## Directory Structure

```
v-shared/                      # THIS REPOSITORY (shared resources)
├── project-notes/             # David ↔ Jan task communication
├── ai-model-research/         # AI image/video generation research
├── scripts/                   # Shared automation scripts
├── CLAUDE.md                  # This file
└── README.md                  # Shared documentation

video-projects/ (parent directory - OTHER REPOS)
├── v-appydave/          # AppyDave brand (FliVideo workflow, b40-b63+)
├── v-voz/               # VOZ client projects (Storyline workflow)
├── v-aitldr/            # AITLDR brand (Storyline workflow)
├── v-beauty-and-joy/    # Joy's brand (placeholder)
├── v-kiros/             # Kiros client (placeholder)
└── v-supportsignal/     # SupportSignal client (placeholder)
```

**Naming Convention**: `v-{brand-name}` where prefix `v-` denotes video projects.

---

## v-shared Specific Directories

### project-notes/
**Purpose**: Communication hub for David and Jan about video project tasks

**How it works**:
- David creates task files (e.g., `task-ai-model-cost-research.md`)
- Jan updates with progress, questions, blockers
- Git-tracked for async collaboration

**Active Tasks**:
- `task-ai-model-cost-research.md` - Research AI image/video generation tools
- `task-pixar-avatars-kiros-supportsignal.md` - Create client avatars

**See**: `project-notes/README.md` for full workflow

---

### ai-model-research/
**Purpose**: Research findings on AI image/video generation tools for movie production

**Goal**: Find cheapest quality AI tools for generating images/videos

**Documentation**:
- `QUICK-START.md` - High-level summary (START HERE)
- `AI-TOOL-DECISION-MATRIX.md` - Which tool for which use case?
- `README.md` - Full research findings (10 tools)
- `cost-analysis.md` - Detailed cost tables
- `platforms.md` - SaaS vs API breakdown
- `s3-setup-uat.md` - AWS S3 setup
- `api-examples/` - Ready-to-run code

**Status**: Research complete, free-tier testing next

**Quick Links**:
- Need recommendation? → `AI-TOOL-DECISION-MATRIX.md`
- Want summary? → `QUICK-START.md`
- Need details? → `README.md` and `cost-analysis.md`

---

## Two Workflow Patterns

### Pattern A: FliVideo Workflow (AppyDave)

**Used for**: Sequential, chapter-based video recording and editing

**Structure**:
```
v-appydave/b{number}-{project-name}/
├── {project-name}.mp4                   # Final video (gitignored)
├── {project-name}.srt                   # Transcript (tracked)
├── {project-name}-{variant}.mp4         # Variants: intro/outro (gitignored)
├── recordings/                          # Individual chapters (gitignored)
│  ├── {chapter}-{take}-{name}.mov
│  └── 02-1-content.mp4                  # Chapter 2, take 1
└── assets/                              # Design docs (tracked)
```

**Naming Conventions**:
- Project: `b{seq}-{kebab-case-name}` (e.g., `b62-remotion-overview`)
- Recording: `{chapter}-{take}-{name}.{mov|mp4}` (e.g., `02-1-content.mov`)
- Multiple takes show iteration: `3-1-build-form.mov`, `3-2-build-form.mov`

**Characteristics**:
- File-name driven (minimal metadata)
- Single folder = single video
- Transcript files (.srt, .txt) always tracked
- Managed by FliVideo gem at `/dev/ad/flivideo/`

**Example**: `v-appydave/b62-remotion-overview/` (476MB, 3 recording chapters)

---

### Pattern B: Storyline Workflow (VOZ, AITLDR)

**Used for**: Narrative-driven, script-first visual content

**Structure**:
```
v-{brand}/{project-name}/
├── data/
│  ├── storyline.json                    # SINGLE SOURCE OF TRUTH (tracked)
│  ├── styleguide.md                     # Visual direction (tracked)
│  ├── source/                           # Raw inputs (tracked)
│  │  ├── beats.json                     # Narrative beats
│  │  ├── transcript.srt                 # Dialogue
│  │  ├── timestamps.txt                 # Frame timing
│  │  └── words.json                     # Word-level analysis
│  └── _archive/                         # Deprecated CSVs
├── assets/
│  ├── characters/                       # Character PNGs (tracked)
│  ├── scenes/                           # Generated scene images (tracked)
│  │  └── 01-1-1-establishing-f4595985.png
│  └── style-reference/                  # Visual guides (tracked)
├── docs/
│  ├── script.md                         # Full narrative (tracked)
│  ├── visual-shotlist.md                # Shot descriptions (tracked)
│  └── visual-shotdeck.md                # Production notes (tracked)
├── original/                            # Initial prompt/concept (tracked)
└── visual-storytelling-pipeline.md      # Process documentation (tracked)
```

**Naming Conventions**:
- Scene image: `{shot}-{variation}-{type}-{label}-{uuid}.png`
  - Example: `01-1-1-establishing-f4595985.png` = Shot 1, Variation 1, Type 1, hash f4595985
- Animation: `{shot}-{variation}-{anim}-{label}-{uuid}.mp4`

**Storyline JSON Structure**:
```json
{
  "metadata": {
    "title": "Project Title",
    "projectName": "project-name",
    "totalBeats": 64,
    "totalVisualConcepts": 34,
    "totalDuration": 298.84
  },
  "beats": [
    {
      "id": 1,
      "timing": { "start": "00:05.56", "end": "00:13.36" },
      "narrative": { "text": "...", "speaker": "narrator" },
      "visualConcepts": [
        {
          "variations": [
            {
              "imagePrompt": "...",
              "imageFile": "01-1-1-establishing-f4595985.png",
              "animations": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

**Pipeline Flow**:
```
SCRIPT → BEATS.JSON → TIMESTAMPS → VISUAL CONCEPTS
    ↓                                      ↓
  STYLEGUIDE                      UNIFIED STORYLINE.JSON
    ↓                                      ↓
SCENE IMAGES ← PROMPTS           REACT MICROAPP (client review)
    ↓
ANIMATED VIDEOS
```

**Characteristics**:
- JSON-driven (single source of truth)
- Heavy documentation (philosophical themes, visual style guides)
- Iteration-friendly (multiple image variations per beat)
- Managed by Storyline App at `/dev/ad/storyline-app/`

**Example**: `v-voz/boy-baker/` (64 beats, 34 visual concepts, 68 image variations)

---

## Final Assets Directory

### Purpose
The `final/` directory contains **publishable final assets** ready for distribution (YouTube, client delivery, web hosting).

### Structure

**Flat structure** (1-2 files):
```
project-name/
└── final/
    ├── project-name-v1.mp4
    └── project-name-v2.mp4
```

**Nested structure** (multiple versions/variants):
```
project-name/
└── final/
    ├── project-name/
    │   ├── project-name-v1.mp4
    │   ├── project-name-v2.mp4
    │   └── project-name-v3.mp4
    └── short-versions/
        ├── project-name-short-v1.mp4
        └── project-name-short-v2.mp4
```

### Naming Convention
- **Format**: `{project-name}-v{version}.{ext}`
- **Style**: lowercase-kebab-case
- **Examples**:
  - `xmen-v1.mp4`
  - `xmen-v2.mp4`
  - `xmen-short-v1.mp4`
  - `rony-american-grace-v1.mp4` (with voice variant identifier)

### Git Tracking
**Exception to video file ignore rules**: Everything in `final/` is **tracked in git**.

While video files (*.mp4, *.mov, etc.) are normally gitignored throughout the project, files in the `final/` directory are explicitly allowed via `.gitignore` exceptions:

```gitignore
# Video files (all formats)
**/*.mp4
**/*.mov
**/*.avi

# Exception: Allow everything in final/ directory
!final/
!final/**
```

**Rationale**: Final publishable assets are:
- Relatively small (optimized for delivery)
- Important to version control
- Needed for deployment pipelines
- Safe to store in git (unlike large raw footage)

### When to Use
- ✅ Final rendered video ready for YouTube
- ✅ Client deliverables
- ✅ Multiple versions for A/B testing
- ✅ Platform-specific exports (16:9, 9:16, 1:1)
- ❌ NOT for work-in-progress renders
- ❌ NOT for raw recordings (use `recordings/` instead)

---

## Git Strategy

### Version Control
- **Tracked**: `.md`, `.json`, `.srt`, `.txt`, `.csv`, small images (`.png`, `.jpg`, `.svg`)
- **Tracked (Exception)**: Everything in `final/` directory (including videos)
- **Ignored**: Video files (`.mp4`, `.mov`, `.avi`, etc.) everywhere else, large design files (`.psd`, `.ai`)

### Large File Storage
- **Active projects**: AWS S3 Standard (~100GB, $2.30/month)
- **Archives**: AWS S3 Glacier (~1TB, $0.99/month)
- **Backup**: External SSD (mount path configured per developer)

### Future: Individual Git Repos
Each `v-*` directory CAN become its own git repository for team collaboration, but currently all projects are tracked in the parent repository.

## Metadata System (Proposed)

**File**: `.metadata.json` (not yet systematically implemented)

**Purpose**: Cross-reference video projects with code projects, content pillars, and related videos.

**Example**:
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

**Links**:
- Code projects: AppyDave app-a-day projects
- Content pillars: AppyDave brand content pillar system
- Related series: Other b{number} projects

## Related Tools & Projects

### FliVideo (Ruby Gem)
- **Location**: `/dev/ad/flivideo/`
- **Purpose**: Video asset management for sequential recording workflow
- **Workflow**: AppyDave brand videos (v-appydave/)
- **Features**: Chapter management, take iteration, version variants

### Storyline App (Node + React)
- **Location**: `/dev/ad/storyline-app/`
- **Purpose**: Narrative-driven visual content creation
- **Workflow**: VOZ and AITLDR projects (v-voz/, v-aitldr/)
- **Features**: Beat-based storytelling, JSON data processor, client review microapp

### Agent Workflow Builder
- **Location**: Dropbox `/team-awb/`
- **Purpose**: Workflow automation configs
- **Note**: May reference video projects via metadata

### GPT Context Gatherer (appydave-tools)
- **Location**: `/dev/ad/appydave-tools/`
- **CLI**: `gpt_context`
- **Purpose**: Collect project files for AI context
- **Example**:
  ```bash
  gpt_context -i '**/*.md' -e '_archive/**/*' -d -o context.txt
  gpt_context -i '**/*' -f tree -d  # Tree view
  ```

## Architecture Decisions

### Why Two Workflows?

**FliVideo (Sequential)**:
- Best for: Tutorial videos, technical walkthroughs, live demonstrations
- Strengths: Fast iteration, natural speaker flow, immediate feedback
- Weakness: Less planning, harder to revise structure after recording

**Storyline (Script-First)**:
- Best for: Narrative stories, client presentations, animated content
- Strengths: Detailed planning, client approval before production, reusable assets
- Weakness: Slower iteration, requires upfront scripting

### Why Unified JSON (Storyline)?

The `storyline.json` serves as the **single source of truth** for all narrative projects:
- **Before**: Multiple CSV files (beats, shotlist, image prompts, animation prompts)
- **After**: One JSON with nested structure (beats → visual concepts → variations → animations)
- **Benefits**:
  - No data sync issues
  - Easy to query/transform
  - Powers React microapp for client review
  - Version-controllable

### Why Separate v-* Folders?

**Brand Separation**:
- Clear ownership (AppyDave vs client projects)
- Different collaboration models (internal vs client access)
- Independent git repositories (future)

**Workflow Isolation**:
- Different tools (FliVideo gem vs Storyline App)
- Different file structures
- Different metadata requirements

## Common Tasks

### Find a project by number
```bash
# AppyDave video
ls v-appydave/ | grep b62

# All projects across brands
find . -name '*boy-baker*' -type d
```

### Check project size
```bash
du -sh v-appydave/b62-remotion-overview
du -sh v-voz/boy-baker
```

### List all transcripts
```bash
find v-appydave -name '*.srt'
find v-voz -name 'transcript.txt'
```

### Verify storyline JSON structure
```bash
# Check if storyline.json exists
find v-voz v-aitldr -name 'storyline.json'

# Validate JSON syntax
jq . v-voz/boy-baker/data/storyline.json > /dev/null && echo "Valid JSON"

# Extract metadata
jq '.metadata' v-voz/boy-baker/data/storyline.json
```

### Create new FliVideo project
```bash
# Determine next sequence number
ls v-appydave/ | grep '^b' | sort | tail -1  # Shows latest (e.g., b63)

# Create structure
mkdir -p v-appydave/b64-new-project/{recordings,assets}
touch v-appydave/b64-new-project/b64-new-project.srt
```

### Create new Storyline project
```bash
# Create full structure
mkdir -p v-voz/new-project/{data/source,assets/{characters,scenes,style-reference},docs,original}
touch v-voz/new-project/data/storyline.json
touch v-voz/new-project/data/styleguide.md
touch v-voz/new-project/docs/script.md
touch v-voz/new-project/visual-storytelling-pipeline.md
```

## Documentation References

- `v-shared/README.md` - Shared documentation overview
- AppyDave ecosystem CLAUDE.md - Overall ecosystem map
- FliVideo CLAUDE.md - FliVideo workflow details
- Storyline App CLAUDE.md - Storyline workflow details
- Individual project `CLAUDE.md` files (e.g., `v-voz/the-point/CLAUDE.md`)

## Key Reminders

1. **Large video files are gitignored** - Never commit .mp4, .mov, .avi files
2. **Always track transcripts** - .srt and .txt files must be version-controlled
3. **Use appropriate workflow** - FliVideo for sequential, Storyline for narrative
4. **Backup before operations** - Always backup to external SSD before making changes
5. **storyline.json is sacred** - For Storyline projects, this is the single source of truth
6. **Cross-reference with code projects** - Video projects often link to code projects and content pillars

---

**Created**: 2025-10-19
**Last Updated**: 2025-10-30
**Purpose**: Shared documentation for unified video project storage across all brands and clients
