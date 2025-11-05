# VAM S3 Staging - Terminology Clarification

**Created**: 2025-11-03
**Purpose**: Clarify staging vs archive vs glacier terminology

---

## Corrected Terminology

### Your Actual Workflow

```
Active Work (Local)
     ↓
SSD Backup (T7 Drive) ←→ S3 Staging (Cloud Collaboration)
     ↓
Glacier Deep Archive (Long-term, rarely accessed)
```

### What Each Term Means

| Term | Location | Purpose | Access Pattern | Cost |
|------|----------|---------|----------------|------|
| **Staging** | Local `s3-staging/` folder + S3 cloud | Active collaboration (David ↔ Jan) | Daily/weekly | $2-5/mo |
| **Archive** | T7 SSD drive (a00-a49, b50-b99 folders) | Completed projects, still accessible | Monthly | Hardware cost |
| **Glacier** | AWS Glacier Deep Archive | 1+ years old, rarely needed | Yearly | $0.20/mo per 200GB |

---

## Phase Breakdown (Corrected)

### ✅ Phase 1: SSD Backup (COMPLETE)
**Current tools**: `generate_manifest.rb`, `sync_from_ssd.rb`, `archive_project.rb`

**Workflow**:
1. Active projects in local flat structure
2. Archive completed projects → T7 SSD (organized in range folders)
3. Pull back light files (transcripts, thumbnails) to local `archived/` folder

**Storage**: T7 external drive (~400GB)

---

### 📋 Phase 3: S3 Staging (THIS PRD) - Active Collaboration
**New tools**: `s3_sync_up.rb`, `s3_sync_down.rb`, `s3_sync_status.rb`, `s3_sync_cleanup.rb`

**Workflow**:
1. David exports raw video → `b65/s3-staging/raw.mp4`
2. David uploads → `s3://video-projects/staging/v-appydave/b65/raw.mp4`
3. Jan downloads from S3 → his local `b65/s3-staging/raw.mp4`
4. Jan edits and uploads → `s3://video-projects/staging/v-appydave/b65/edited.mp4`
5. David downloads Jan's edit
6. When done: Clean up S3 (or auto-delete after 90 days)

**Storage**: AWS S3 Standard (~20-50GB active)
**Cost**: $2-5/month

---

### 🔮 Phase 2: Glacier Deep Archive (FUTURE) - Long-term Cold Storage
**Future tools**: `backup_to_glacier.rb`, `restore_from_glacier.rb`

**Workflow**:
1. Projects 1+ years old on T7 drive
2. Upload to Glacier → AWS Glacier Deep Archive
3. Delete from T7 (optional, frees up drive space)
4. Restore takes 12-48 hours when needed

**Storage**: AWS Glacier (~200-400GB)
**Cost**: $0.20-0.40/month

---

## AWS Bucket Structure (Corrected)

### Single Bucket: `video-projects`

```
s3://video-projects/
└── staging/                    # Phase 3: Active collaboration ONLY
    ├── v-appydave/
    │   ├── b65-guy-monroe-marketing-plan/
    │   │   ├── raw.mp4         # David uploads
    │   │   └── edited.mp4      # Jan uploads
    │   ├── b66-context-engineered-html-art/
    │   └── b67-vam-s3-staging/
    ├── v-voz/
    │   ├── boy-baker/
    │   └── the-point/
    └── v-aitldr/
        ├── appydave-advert/
        └── movie-posters/
```

**Lifecycle**: Auto-delete after 90 days (prevents forgotten files)

**No "archive/" prefix** - Glacier integration (Phase 2) will use:
- Either separate Glacier vault
- Or separate bucket for long-term storage
- TBD when implementing Phase 2

---

## Local Folder Structure (Corrected)

### Active Project (In Progress)
```
v-appydave/b65-guy-monroe-marketing-plan/
├── s3-staging/              # ← NEW: Cloud collaboration folder
│   ├── raw.mp4              # Synced with S3
│   └── edited.mp4           # Synced with S3
├── recordings/              # Local-only raw recordings (gitignored)
│   ├── 01-1-intro.mov
│   └── 02-1-content.mov
├── final/                   # Local-only final exports (gitignored)
│   └── b65-v1.mp4           # Final published version
├── assets/                  # Thumbnails, images (git tracked)
└── b65.srt                  # Transcript (git tracked)
```

### Archived Project (Completed, on T7)
```
v-appydave/archived/b50-b99/b63-flivideo/
├── b63.srt                  # Light files synced from T7
├── b63.md                   # Light files synced from T7
└── assets/                  # Light files synced from T7
    └── thumbnail.png

# Heavy files (videos) only on T7:
/Volumes/T7/youtube-PUBLISHED/appydave/b50-b99/b63-flivideo/
├── b63.mp4
├── recordings/
│   └── *.mov
└── final/
    └── b63-v1.mp4
```

---

## .gitignore Strategy (Corrected)

**Goal**: Prevent video files from being pushed to GitHub

```gitignore
# Video files (all formats) - NO EXCEPTIONS
**/*.mp4
**/*.mov
**/*.avi
**/*.mkv
**/*.webm

# S3 staging folder (synced via S3 tools, not git)
**/s3-staging/
**/s3-staging/**

# Recordings (local raw files, not git tracked)
**/recordings/
**/recordings/**

# Final exports (local only, NOT tracked in git)
**/final/
**/final/**

# Video Asset Tools config (per-developer paths)
.video-tools.env

# Generated manifest
projects.json
```

**Removed**: Exception for `final/` directory (was causing 1GB+ push failures)

---

## Key Corrections Made

### ❌ Previous Confusion
- Called S3 folder "archive/" when it's actually for active collaboration
- Mixed Phase 2 (Glacier) with Phase 3 (S3 staging)
- Bucket name "appydave-video-projects" implied single brand

### ✅ Corrected Understanding
- **S3 = Staging** (active collaboration, temporary)
- **T7 SSD = Archive** (completed projects, organized storage)
- **Glacier = Deep Archive** (1+ years old, rarely accessed)
- **Bucket name = "video-projects"** (multi-brand)

---

## Summary: What This Phase Does

**Phase 3 (S3 Staging)** is ONLY about:
1. ✅ Sharing large files between David and Jan
2. ✅ Temporary cloud storage (90-day auto-delete)
3. ✅ Bypassing GitHub size limits
4. ✅ Enabling remote collaboration

**Phase 3 is NOT about**:
- ❌ Long-term archival (that's T7 drive + future Glacier)
- ❌ Cost savings on storage (S3 Standard is more expensive than SSD)
- ❌ Backup strategy (that's T7 drive)

**Purpose**: Enable David (Thailand) ↔ Jan (Philippines) to share 1GB+ video files for active projects

---

## Related Documentation

- `vam-s3-staging-design.md` - Main PRD (product requirements)
- `vam-s3-aws-architecture.md` - Multi-business unit strategy (UPDATED)
- `vam-s3-status.md` - Implementation status
- `roadmap.md` - All phases overview

---

**Clarified**: 2025-11-03
**Bucket**: `video-projects` (not "appydave-video-projects")
**Prefix**: `staging/` only (no "archive/" prefix for this phase)
