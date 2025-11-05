# Video Asset Tools

**Shared video project management tools** for archiving, syncing, and tracking video assets across local storage and SSD backups.

## Overview

These tools manage a sophisticated **video asset workflow** for projects with large media files:

- **Heavy files** (videos): Archived to external SSD, synced to S3 (future)
- **Light files** (transcripts, thumbnails, docs): Kept locally in grouped folders
- **Manifest tracking**: Single JSON source of truth for all project locations

### Core Concepts

**Storage Tiers**:
1. **Local Flat** - Active projects at repository root
2. **Local Archived** - Light files in `archived/{range}/{project}/`
3. **SSD Backup** - Full backups on external drive
4. **S3/Glacier** - Cloud storage (roadmap)

**Project Structure**:
- **Naming**: `{letter}{number}-{name}` (e.g., `b63-flivideo`)
- **Range folders**: `a00-a49`, `b50-b99`, etc. (50-project groups)
- **Heavy vs Light**: MP4/MOV vs SRT/PNG/MD/JSON

## Tools

### Core Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| `generate_manifest.rb` | Scan and create projects.json | `ruby bin/generate_manifest.rb` |
| `archive_project.rb` | Archive project to SSD | `ruby bin/archive_project.rb b63-project [--dry-run]` |
| `sync_from_ssd.rb` | Pull light files from SSD | `ruby bin/sync_from_ssd.rb [--dry-run]` |
| `dashboard.html` | Visualize project state | `open bin/dashboard.html` |

### Utilities

| Tool | Purpose |
|------|---------|
| `utils/verify_and_cleanup_duplicates.rb` | One-time cleanup for folder naming bugs |

## Quick Start

### 1. Setup Configuration

```bash
# From your video project repository root (e.g., v-appydave/)
cd /path/to/video-projects/v-appydave

# Copy example config
cp ../v-shared/video-asset-tools/.env.example .video-tools.env

# Edit with your SSD path
nano .video-tools.env
```

**Example `.video-tools.env`**:
```bash
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave
```

### 2. Generate Manifest

```bash
# Scans local and SSD, creates projects.json
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
```

**Output**:
- `projects.json` at repository root
- Disk usage statistics
- Validation warnings

### 3. View Dashboard

```bash
open ../v-shared/video-asset-tools/bin/dashboard.html
```

**Features**:
- Three tabs: Local Flat, SSD, Local Archived
- Search/filter projects
- Color-coded status (backed up, not backed up, fully migrated)
- Disk usage stats

### 4. Archive a Project

```bash
# Preview (dry-run)
ruby ../v-shared/video-asset-tools/bin/archive_project.rb b63-flivideo --dry-run

# Execute
ruby ../v-shared/video-asset-tools/bin/archive_project.rb b63-flivideo

# Batch archive oldest 5 projects
ruby ../v-shared/video-asset-tools/bin/archive_project.rb --next 5
```

**What it does**:
1. Copies entire project to SSD
2. Deletes local folder
3. Run sync to pull back light files

### 5. Sync Light Files

```bash
# Preview
ruby ../v-shared/video-asset-tools/bin/sync_from_ssd.rb --dry-run

# Execute
ruby ../v-shared/video-asset-tools/bin/sync_from_ssd.rb
```

**What it does**:
- Pulls transcripts, thumbnails, docs from SSD
- Skips video files
- Creates `archived/{range}/{project}/`

## Workflows

### Archive Workflow (Standard)

```bash
# 1. Archive project to SSD
ruby ../v-shared/video-asset-tools/bin/archive_project.rb b63-flivideo

# 2. Sync light files back to archived/
ruby ../v-shared/video-asset-tools/bin/sync_from_ssd.rb

# 3. Update manifest and dashboard
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
```

### Batch Archive Workflow

```bash
# Archive 10 oldest projects
ruby ../v-shared/video-asset-tools/bin/archive_project.rb --next 10 --dry-run  # Preview
ruby ../v-shared/video-asset-tools/bin/archive_project.rb --next 10            # Execute
ruby ../v-shared/video-asset-tools/bin/sync_from_ssd.rb
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
```

### Restore Workflow

```bash
# Manually copy from SSD to local
cp -r /Volumes/T7/youtube-PUBLISHED/appydave/b50-b99/b63-flivideo ./

# Update manifest
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
```

## File Patterns

### Heavy Files (Excluded from sync)
```
*.mp4, *.mov, *.avi, *.mkv, *.webm
```

### Light Files (Included in sync)
```
**/*.srt      # Subtitles
**/*.vtt      # WebVTT
**/*.txt      # Text docs
**/*.md       # Markdown
**/*.jpg      # Images
**/*.jpeg
**/*.png
**/*.webp
**/*.json     # Metadata
**/*.yml
**/*.yaml
```

## Configuration

### Environment File (.video-tools.env)

**Location**: Repository root (e.g., `v-appydave/.video-tools.env`)

**Required**:
```bash
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave
```

**Optional (Future)**:
```bash
AWS_REGION=us-east-1
S3_BUCKET=appydave-video-archive
GLACIER_VAULT=appydave-long-term-archive
```

**Git Ignore**: Add `.video-tools.env` to `.gitignore` (environment-specific)

### Per-Developer Setup

Each developer creates their own `.video-tools.env`:

**David (Mac)**:
```bash
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave
```

**Jan (Windows with Git Bash)**:
```bash
SSD_BASE=/d/T7/youtube-PUBLISHED/appydave
```

## Manifest Structure (projects.json)

```json
{
  "config": {
    "local_base": "/Users/davidcruwys/dev/video-projects/v-appydave",
    "ssd_base": "/Volumes/T7/youtube-PUBLISHED/appydave",
    "last_updated": "2025-11-03T10:30:00Z",
    "disk_usage": {
      "local_flat": { "total_gb": 3.93 },
      "local_grouped": { "total_gb": 1.55 },
      "ssd": { "total_gb": 400.61 }
    }
  },
  "projects": [
    {
      "id": "b63-flivideo",
      "storage": {
        "ssd": {
          "exists": true,
          "path": "b50-b99/b63-flivideo"
        },
        "local": {
          "exists": true,
          "structure": "flat",
          "has_heavy_files": true,
          "has_light_files": true
        }
      }
    }
  ]
}
```

## Validation & Safety

### Built-in Validations

- **SSD mount check**: Exits if SSD not available
- **Project ID format**: Validates naming convention
- **Structure consistency**: Warns if grouped projects fall within flat range
- **Duplicate detection**: Prevents syncing if flat folder exists (stale manifest)

### Dry-Run Mode

**Always preview before executing**:

```bash
ruby bin/archive_project.rb b63-project --dry-run
ruby bin/sync_from_ssd.rb --dry-run
```

### Defensive Operations

- Sync checks manifest AND filesystem to prevent duplicates
- Archive skips copy if project already exists on SSD
- Size verification when comparing duplicates (allows 1KB difference for .DS_Store)

## Troubleshooting

### SSD not mounted error

```bash
# Check if SSD is mounted
ls /Volumes/T7/youtube-PUBLISHED/appydave

# If not, connect T7 SSD and wait for mount
```

### Configuration file not found

```bash
# Verify .video-tools.env exists in repository root
ls -la .video-tools.env

# Create if missing
cp ../v-shared/video-asset-tools/.env.example .video-tools.env
nano .video-tools.env  # Edit SSD_BASE
```

### Manifest shows wrong counts

```bash
# Regenerate from scratch
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
```

### Dashboard not loading

```bash
# Check projects.json exists
ls -la projects.json

# Regenerate manifest
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb

# Open dashboard
open ../v-shared/video-asset-tools/bin/dashboard.html
```

## Future: S3/Glacier Integration

See `ROADMAP.md` for planned cloud storage features:

- **S3 upload** - Push to cloud from SSD
- **Glacier archival** - Long-term cost-effective storage
- **Restore tools** - Pull from cloud when needed
- **Lifecycle automation** - Auto-transition between tiers

## Examples

### Check disk usage

```bash
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
# Output shows disk usage for local flat, local grouped, and SSD
```

### Find projects not backed up

```bash
# View dashboard, filter "Not backed up" in Local Flat tab
open ../v-shared/video-asset-tools/bin/dashboard.html
```

### Archive all projects before b50

```bash
# Manually check oldest flat projects
ls -1 | grep '^[a-b][0-4][0-9]'

# Archive them (adjust count as needed)
ruby ../v-shared/video-asset-tools/bin/archive_project.rb --next 20 --dry-run
ruby ../v-shared/video-asset-tools/bin/archive_project.rb --next 20
ruby ../v-shared/video-asset-tools/bin/sync_from_ssd.rb
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb
```

## Support & Documentation

- **Roadmap**: See `docs/roadmap.md` for S3/Glacier and team collaboration plans
- **Issues**: Report in GitHub issues for the v-shared repository

## Additional Documentation

See `docs/` folder for:
- `roadmap.md` - Future phases (S3/Glacier archival, team collaboration sync)
- `s3-integration-setup.md` - Complete AWS S3 setup guide (buckets, IAM, policies)
- `s3-desktop-tools-research.md` - Desktop GUI tools for S3 management (S3 Browser, CloudMounter, etc.)

## Related Projects

- **FliVideo** - `/dev/ad/flivideo/` - Video asset management gem
- **Storyline App** - `/dev/ad/storyline-app/` - Narrative video workflow
- **AppyDave Tools** - `/dev/ad/appydave-tools/` - GPT context gathering

---

**Created**: 2025-11-03
**Last Updated**: 2025-11-03
**Version**: 1.0.0
