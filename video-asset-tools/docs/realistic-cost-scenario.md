# Realistic Cost Scenario - David's Actual Usage

**Created**: 2025-11-03
**Purpose**: Real-world cost estimate based on David's current storage patterns
**Status**: Accurate projection

---

## Current State (Before S3/Glacier)

### David's Storage Profile

| Location | Purpose | Project Count | Total Size | Cost |
|----------|---------|---------------|------------|------|
| **Local Flat** | Active work-in-progress | 10 projects | 10-15GB | $0 (laptop SSD) |
| **Local Archived/** | Light files from completed projects | 100 projects | 2GB | $0 (laptop SSD) |
| **T7 SSD Drive** | Full backups of completed projects | 200 projects | 2TB | $0/month (one-time $100 hardware) |

**Total Current Cost**: $0/month (hardware already purchased)

---

## Future State (With S3 + Selective Glacier)

### Storage Tiers Breakdown

```
┌─────────────────────────────────────────────────────────┐
│ TIER 1: Local Active (10 projects, 10-15GB)            │
│ - Working files on laptop                              │
│ - Cost: $0/month                                        │
└─────────────────────────────────────────────────────────┘
                    ↓
        When project completed
                    ↓
┌─────────────────────────────────────────────────────────┐
│ TIER 2: S3 Staging (5-10 active collab, 20-50GB)      │
│ - David ↔ Jan file sharing                             │
│ - Temporary (90-day auto-delete)                        │
│ - Cost: $2-5/month                                      │
└─────────────────────────────────────────────────────────┘
                    ↓
        Manual cleanup or auto-delete
                    ↓
┌─────────────────────────────────────────────────────────┐
│ TIER 3: T7 SSD Archive (200 projects, 2TB)            │
│ - Full project backups                                  │
│ - Recent 1 year of work                                │
│ - Cost: $0/month (hardware already owned)              │
└─────────────────────────────────────────────────────────┘
                    ↓
        After 180 days on T7
                    ↓
┌─────────────────────────────────────────────────────────┐
│ TIER 4: S3 Standard (Metadata Only, ~5GB)             │
│ - Thumbnails, transcripts, SRT files                   │
│ - Blog generation needs                                 │
│ - Always accessible                                     │
│ - Cost: $0.12/month                                     │
└─────────────────────────────────────────────────────────┘
                    ↓
        Heavy files (MP4, MOV) only
                    ↓
┌─────────────────────────────────────────────────────────┐
│ TIER 5: Glacier Deep Archive (Heavy files, 1.5TB)     │
│ - MP4, MOV, large media files only                     │
│ - Projects 1+ years old                                 │
│ - Already on YouTube (redundant copy)                   │
│ - Retrieval: 12-48 hours                                │
│ - Cost: $1.50/month                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Detailed Cost Breakdown

### S3 Staging (Active Collaboration)

**Scenario**: 5-10 active projects with David ↔ Jan collaboration

| Item | Calculation | Monthly Cost |
|------|-------------|--------------|
| Storage (20GB avg) | 20GB × $0.023/GB | $0.46 |
| PUT requests (100 uploads) | 100 × $0.005/1000 | $0.0005 |
| GET requests (100 downloads) | 100 × $0.0004/1000 | $0.00004 |
| Transfer OUT (to Thailand) | 20GB × $0.09/GB | $1.80 |
| **S3 Staging Total** | | **$2.26/month** |

**Lifecycle**: Auto-delete after 90 days (or manual cleanup)

---

### S3 Standard (Metadata Only)

**Scenario**: Light files from 200 archived projects

| File Type | Per Project | Total (200 projects) | Purpose |
|-----------|-------------|---------------------|---------|
| Thumbnail (PNG/JPG) | 50KB | 10MB | Blog posts |
| Transcript (SRT) | 10KB | 2MB | SEO, blog content |
| Metadata (JSON/MD) | 5KB | 1MB | Project info |
| Small assets | 10KB | 2MB | Icons, small images |
| **Total per tier** | **~25KB** | **~5GB** | **Always accessible** |

| Item | Calculation | Monthly Cost |
|------|-------------|--------------|
| Storage (5GB metadata) | 5GB × $0.023/GB | $0.12 |
| GET requests (monthly blog gen) | 200 × $0.0004/1000 | $0.00008 |
| **S3 Metadata Total** | | **$0.12/month** |

---

### Glacier Deep Archive (Heavy Files Only)

**Scenario**: Video files from 200 projects, 1+ years old

| File Type | Avg Size | Total (200 projects) | Glacier? |
|-----------|----------|---------------------|----------|
| Final MP4 | 1-3GB | 400GB | ✅ Yes |
| Recordings (MOV) | 4-6GB | 1TB | ✅ Yes |
| Edited versions | 500MB-1GB | 100GB | ✅ Yes |
| **Heavy files total** | | **1.5TB** | |
| Thumbnails, SRT, MD | 25KB | 5GB | ❌ No (S3 Standard) |

| Item | Calculation | Monthly Cost |
|------|-------------|--------------|
| Storage (1.5TB video files) | 1500GB × $0.001/GB | $1.50 |
| **Glacier Total** | | **$1.50/month** |

**Note**: Only move MP4/MOV files to Glacier, keep metadata in S3 Standard

---

## Total Monthly Cost (All Tiers)

| Tier | Purpose | Size | Monthly Cost |
|------|---------|------|--------------|
| Tier 1: Local Active | Work-in-progress | 10-15GB | $0 |
| **Tier 2: S3 Staging** | David ↔ Jan collab | 20GB | **$2.26** |
| Tier 3: T7 SSD | Recent backups (1 year) | 2TB | $0 |
| **Tier 4: S3 Metadata** | Blog generation needs | 5GB | **$0.12** |
| **Tier 5: Glacier Videos** | Long-term heavy files | 1.5TB | **$1.50** |
| **TOTAL** | | **3.5TB** | **$3.88/month** |

**Compared to**:
- T7 SSD only: $0/month (current)
- All S3 Standard: ~$90/month (3TB × $0.03)
- Dropbox 3TB: $20/month
- Google Drive 2TB: $10/month

**ROI**: $3.88/month for:
- ✅ Offsite backup (Glacier)
- ✅ Team collaboration (S3 Staging)
- ✅ Always-accessible metadata (S3 Standard)
- ✅ Free up T7 space (can archive 1+ year old projects)

---

## Selective Glacier Migration Strategy

### What Goes to Glacier (Heavy Files)

**File Extension Patterns**:
```
*.mp4
*.mov
*.avi
*.mkv
*.webm
*.m4v
*.flv
```

**Size Threshold**: Files > 100MB

**Age Threshold**: Projects > 1 year old (365 days)

**Example Project Structure**:
```
b40-old-project/
├── final/
│   └── b40-v1.mp4              → ✅ GLACIER (2GB)
├── recordings/
│   ├── 01-intro.mov            → ✅ GLACIER (1.5GB)
│   ├── 02-content.mov          → ✅ GLACIER (3GB)
│   └── 03-outro.mov            → ✅ GLACIER (1GB)
├── assets/
│   └── thumbnail.png           → ❌ S3 Standard (50KB)
├── b40.srt                     → ❌ S3 Standard (10KB)
├── b40.md                      → ❌ S3 Standard (5KB)
└── metadata.json               → ❌ S3 Standard (2KB)
```

**Result**:
- Heavy files (7.5GB) → Glacier Deep Archive
- Light files (67KB) → S3 Standard (always accessible)

---

### What Stays in S3 Standard (Always Accessible)

**Needed for Blog Generation**:
- Thumbnails (PNG, JPG) - Social sharing, blog posts
- Transcripts (SRT) - SEO, blog content, search
- Markdown files (MD) - Project descriptions
- Metadata (JSON) - Project info, tags, dates
- Small assets (< 100KB) - Icons, logos, small images

**Rationale**:
- Video files already on YouTube (redundant backup)
- Blog posts only need metadata + thumbnails
- Can regenerate content without downloading videos
- Glacier retrieval (12-48 hours) would break blog generation

---

## Migration Workflow

### Manual Selective Glacier Migration

```ruby
# Pseudocode for selective_glacier_migrate.rb

def migrate_project_to_glacier(project_id)
  project_path = get_project_path(project_id)

  # Find heavy files only
  heavy_files = find_files(project_path, [
    '*.mp4', '*.mov', '*.avi', '*.mkv'
  ]).select { |f| File.size(f) > 100.MB }

  heavy_files.each do |file|
    # Upload to Glacier
    glacier_key = "archive/v-appydave/#{project_id}/#{relative_path(file)}"
    upload_to_glacier(file, glacier_key)

    # Delete from T7 (optional)
    File.delete(file) if confirm_delete?

    # Keep metadata in S3 Standard
    metadata = {
      original_path: file,
      glacier_key: glacier_key,
      size: File.size(file),
      archived_at: Time.now
    }
    upload_to_s3(metadata, "metadata/#{project_id}.json")
  end

  # Light files stay in S3 Standard
  light_files = find_files(project_path, [
    '*.png', '*.jpg', '*.srt', '*.md', '*.json'
  ])

  light_files.each do |file|
    s3_key = "metadata/v-appydave/#{project_id}/#{relative_path(file)}"
    upload_to_s3(file, s3_key)
  end
end
```

---

## Lifecycle Automation

### S3 Lifecycle Policy (Updated)

**Three different rules for different prefixes**:

#### Rule 1: Staging → Auto-Delete (90 days)
```json
{
  "Id": "CleanupStaging",
  "Status": "Enabled",
  "Filter": { "Prefix": "staging/" },
  "Expiration": { "Days": 90 }
}
```

#### Rule 2: Metadata → Stay in S3 Standard (Forever)
```json
{
  "Id": "KeepMetadata",
  "Status": "Enabled",
  "Filter": { "Prefix": "metadata/" },
  "Transitions": []
}
```
**Note**: No Glacier transition - metadata stays accessible

#### Rule 3: Archive → Transition to Glacier (180 days)
```json
{
  "Id": "ArchiveToGlacier",
  "Status": "Enabled",
  "Filter": { "Prefix": "archive/" },
  "Transitions": [
    {
      "Days": 180,
      "StorageClass": "GLACIER"
    }
  ]
}
```
**Note**: Only heavy files (MP4, MOV) should be in `archive/` prefix

---

## S3 Bucket Structure (Revised)

```
s3://video-projects/
├── staging/                    # Temp collaboration (90-day auto-delete)
│   ├── v-appydave/
│   ├── v-voz/
│   └── v-aitldr/
│
├── metadata/                   # Always accessible (S3 Standard)
│   ├── v-appydave/
│   │   ├── b40-old-project/
│   │   │   ├── thumbnail.png
│   │   │   ├── b40.srt
│   │   │   ├── b40.md
│   │   │   └── metadata.json
│   │   └── b65-guy-monroe/
│   │       └── ...
│   ├── v-voz/
│   └── v-aitldr/
│
└── archive/                    # Heavy files (→ Glacier after 180 days)
    ├── v-appydave/
    │   ├── b40-old-project/
    │   │   ├── final/
    │   │   │   └── b40-v1.mp4              (2GB → Glacier)
    │   │   └── recordings/
    │   │       ├── 01-intro.mov            (1.5GB → Glacier)
    │   │       └── 02-content.mov          (3GB → Glacier)
    │   └── b50-another/
    │       └── ...
    ├── v-voz/
    └── v-aitldr/
```

---

## Cost Optimization Strategies

### Strategy 1: Aggressive Staging Cleanup
- Auto-delete after 60 days (instead of 90)
- Saves: ~$0.50/month

### Strategy 2: Selective Archival
- Only archive projects actually on YouTube
- Don't archive failed/draft projects
- Saves: ~30% storage costs

### Strategy 3: Compress Before Glacier
- Use ffmpeg to re-encode old videos at lower bitrate
- 50% size reduction possible
- Saves: ~$0.75/month (Glacier)

### Strategy 4: Periodic Glacier Cleanup
- Delete videos older than 5 years (truly obsolete)
- Or move to Glacier Deep Archive → Delete after YouTube confirm

---

## ROI Analysis

### Option A: Keep Everything on T7 (Current)
**Cost**: $0/month
**Pros**: Simple, no cloud costs
**Cons**:
- ❌ No offsite backup (fire, theft, drive failure)
- ❌ No collaboration (David can't share with Jan)
- ❌ T7 drive will fill up eventually

### Option B: S3 + Selective Glacier (Proposed)
**Cost**: $3.88/month (~$47/year)
**Pros**:
- ✅ Offsite backup (Glacier)
- ✅ Team collaboration (S3 Staging)
- ✅ Always-accessible metadata (blog generation)
- ✅ Free up T7 drive space
**Cons**:
- Small monthly cost
- Glacier retrieval takes 12-48 hours

### Option C: All S3 Standard (No Glacier)
**Cost**: ~$90/month
**Pros**: Everything always accessible
**Cons**: ❌ 23x more expensive

---

## Recommendation

✅ **Implement Option B** (S3 + Selective Glacier)

**Rationale**:
1. $3.88/month is negligible for offsite backup
2. Enables David ↔ Jan collaboration (unblocks current bottleneck)
3. Metadata always accessible for blog generation
4. Video files already on YouTube (Glacier is redundant backup)
5. Can free up T7 drive space over time

---

## Related Documentation

- `vam-s3-staging-design.md` - Main PRD
- `s3-integration-setup.md` - AWS setup guide
- `brand-configuration.md` - Brand configuration system

---

**Status**: Cost scenario complete
**Recommendation**: Proceed with implementation
**ROI**: $3.88/month for offsite backup + collaboration
