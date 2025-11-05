# VAM S3 Staging System - Design Document

**Created**: 2025-11-03
**Purpose**: Enable cloud-based file sharing between David (Thailand) and Jan (Philippines) for video collaboration
**Status**: Planning / Design phase

---

## Problem Statement

### Current Issues

1. **GitHub size limits**: Raw video files (1GB+) cannot be pushed to GitHub
2. **Final directory exception**: `.gitignore` has exception for `final/` causing large files to be tracked
3. **Collaboration bottleneck**: Jan cannot access raw files David creates (e.g., Gling AI exports)
4. **No cloud sync**: Currently only local + SSD storage, no cloud collaboration layer

### Example Projects Affected

- **b65-guy-monroe-marketing-plan**: 1.1GB raw file in `final/`
- **b66-context-engineered-html-art**: 899MB raw file in `final/`

### Workflow Requirement

```
David (Thailand)                 S3 Cloud                    Jan (Philippines)
┌──────────────┐                ┌────────────┐              ┌──────────────┐
│ b65-project/ │                │ S3 Bucket  │              │ b65-project/ │
│  s3-staging/ │                │  staging/  │              │  s3-staging/ │
│   raw.mp4    │──sync_up──────>│  b65/      │──sync_down──>│   raw.mp4    │
│              │                │   raw.mp4  │              │   edited.mp4 │
│  edited.mp4  │<──sync_down────│            │<──sync_up────│              │
└──────────────┘                └────────────┘              └──────────────┘
```

---

## Solution Design

### Folder Convention

Each video project gets an **`s3-staging/`** folder for cloud collaboration:

```
v-appydave/
├── b65-guy-monroe-marketing-plan/
│   ├── s3-staging/              # ← NEW: Cloud sync folder
│   │   ├── raw.mp4              # David uploads
│   │   └── edited.mp4           # Jan uploads
│   ├── final/                   # Local-only final exports (gitignored)
│   ├── recordings/              # Local-only raw recordings (gitignored)
│   └── *.srt, *.md, etc.        # Metadata (git tracked)
```

### .gitignore Strategy

**Update `.gitignore`** to handle three scenarios:

1. **`s3-staging/`**: Ignore all files (handled by S3 sync tools)
2. **`final/`**: Remove exception, ignore all video files
3. **`recordings/`**: Already ignored (existing pattern)

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

# Final exports (local only, NOT tracked in git)
**/final/*.mp4
**/final/*.mov
**/final/*.avi
```

---

## S3 Bucket Structure

### Single Bucket with Brand/Project Prefixes

**Bucket**: `video-projects` (same bucket as archival)

```
s3://video-projects/
├── archive/                     # Phase 2: Long-term archival (existing plan)
│   └── appydave/
│       └── b00-b49/
│
└── staging/                     # Phase 3: Team collaboration (THIS FEATURE)
    ├── v-appydave/
    │   ├── b65-guy-monroe-marketing-plan/
    │   │   ├── raw.mp4                      # David → S3
    │   │   ├── edited.mp4                   # Jan → S3
    │   │   └── .metadata.json               # Sync metadata
    │   ├── b66-context-engineered-html-art/
    │   │   └── raw.mp4
    │   └── b67-vam-s3-staging/
    │       └── test.mp4
    │
    ├── v-voz/
    │   └── boy-baker/
    │       └── scene-01.mp4
    │
    └── v-aitldr/
        └── appydave-advert/
            └── draft.mp4
```

**Key Design Decisions**:
- ✅ **One bucket**: Reuse existing `video-projects` bucket
- ✅ **Brand prefix**: `staging/v-{brand}/` matches local folder structure
- ✅ **Project-level folders**: Each project has dedicated S3 folder
- ✅ **Lifecycle**: Auto-delete files older than 90 days (prevent forgotten files)

---

## Tool Design

### New Tools in `video-asset-tools/bin/`

#### 1. `s3_sync_up.rb` - Upload to S3

**Purpose**: Upload files from local `s3-staging/` to S3

**Usage**:
```bash
# Upload specific project
cd /Users/davidcruwys/dev/video-projects/v-appydave
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65-guy-monroe-marketing-plan

# Upload all projects with s3-staging/ folders
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb --all

# Dry run
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65 --dry-run
```

**Behavior**:
- Reads `.video-tools.env` for S3 bucket and credentials
- Syncs `{project}/s3-staging/*` → `s3://bucket/staging/v-appydave/{project}/`
- Uses multipart upload for files >5GB
- Shows progress bar for large files
- Creates `.metadata.json` with upload timestamp, user

---

#### 2. `s3_sync_down.rb` - Download from S3

**Purpose**: Download files from S3 to local `s3-staging/`

**Usage**:
```bash
# Download specific project
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb b65-guy-monroe-marketing-plan

# Download all projects
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb --all

# Check for updates without downloading
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb --check-only
```

**Behavior**:
- Creates `s3-staging/` folder if doesn't exist
- Only downloads files newer than local versions (timestamp check)
- Shows what was uploaded by whom (via metadata)
- Skips files that haven't changed

---

#### 3. `s3_sync_status.rb` - Check sync status

**Purpose**: Show what's in S3 vs local

**Usage**:
```bash
# Check status for project
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb b65

# Check all projects
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb --all
```

**Output**:
```
📊 S3 Staging Status: b65-guy-monroe-marketing-plan

Local s3-staging/:
  ✅ raw.mp4 (1.1GB) - Last modified: 2025-11-02 12:17
  ❌ edited.mp4 - Not in local (exists in S3)

S3 staging/v-appydave/b65/:
  ✅ raw.mp4 (1.1GB) - Uploaded by: david @ 2025-11-02 12:30
  ✅ edited.mp4 (950MB) - Uploaded by: jan @ 2025-11-03 08:15

Recommendation:
  ⬇️  Run sync_down to get: edited.mp4
```

---

#### 4. `s3_sync_cleanup.rb` - Clean up after project complete

**Purpose**: Delete S3 files when project is done

**Usage**:
```bash
# Clean specific project
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b65 --confirm

# List what would be deleted
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b65
```

**Behavior**:
- Deletes all files in `s3://bucket/staging/v-appydave/{project}/`
- Requires `--confirm` flag to prevent accidents
- Optionally moves to archive before deleting

---

## Configuration

### `.video-tools.env` Updates

**Add S3 staging configuration**:

```bash
# Existing SSD config
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave

# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# S3 Bucket (single bucket for both uses)
S3_BUCKET=video-projects

# S3 Staging Configuration
S3_STAGING_PREFIX=staging/v-appydave/
S3_SYNC_USER=david                    # Tracks who uploaded what

# Lifecycle
S3_STAGING_CLEANUP_DAYS=90           # Auto-delete after 90 days
```

**Jan's `.video-tools.env`** (similar but different user):
```bash
S3_BUCKET=video-projects
S3_STAGING_PREFIX=staging/v-appydave/
S3_SYNC_USER=jan
```

---

## Workflow Examples

### Scenario 1: David shares raw file with Jan

**David's workflow**:
```bash
# 1. Export from Gling AI to s3-staging/
cd v-appydave/b65-guy-monroe-marketing-plan
mkdir -p s3-staging
mv ~/Downloads/raw-export.mp4 s3-staging/raw.mp4

# 2. Upload to S3
cd ..
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65

# 3. Notify Jan (Slack/email)
# "Raw file uploaded to b65 S3 staging"
```

**Jan's workflow**:
```bash
# 1. Check what's available
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb b65

# 2. Download raw file
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb b65

# 3. Edit video
# ... editing in DaVinci Resolve, Adobe Premiere, etc.

# 4. Upload edited version
mv edited-final.mp4 b65-guy-monroe-marketing-plan/s3-staging/edited.mp4
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65

# 5. Notify David
# "Edited version uploaded to S3"
```

**David gets edits**:
```bash
# 1. Check status
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb b65

# 2. Download Jan's edits
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb b65

# 3. Review and finalize
# Move to final/ folder when ready
mv b65/s3-staging/edited.mp4 b65/final/b65-v1.mp4

# 4. Clean up S3
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b65 --confirm
```

---

### Scenario 2: VOZ storyline project (v-voz)

**Same tools work across all brands**:
```bash
cd /Users/davidcruwys/dev/video-projects/v-voz

# Upload scene renders
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb boy-baker

# Jan downloads
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb boy-baker
```

**S3 path**: `s3://video-projects/staging/v-voz/boy-baker/`

---

## Security & Cost

### IAM Permissions

**Required S3 permissions** (already covered in `s3-integration-setup.md`):
- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`
- `s3:GetObjectMetadata`

**Separate IAM users**:
- `david-video-projects` (David's credentials)
- `jan-video-projects` (Jan's credentials)

### Cost Estimates

**Typical usage** (5 active projects, 20GB total in staging):
- Storage: 20GB × $0.023 = **$0.46/month**
- PUT requests: 100 uploads × $0.005/1000 = **$0.0005**
- GET requests: 100 downloads × $0.0004/1000 = **$0.00004**
- Transfer OUT (Thailand): 20GB × $0.09 = **$1.80/month**

**Total**: ~**$2.26/month** for typical collaboration

**With lifecycle cleanup** (90-day auto-delete):
- Files auto-deleted after 90 days
- No manual cleanup needed
- Prevents forgotten files from accumulating

---

## Advantages Over Alternatives

### Why S3 Staging vs Other Solutions?

| Solution | Cost | Speed | Control | Integration |
|----------|------|-------|---------|-------------|
| **S3 Staging** | $2-5/mo | Fast (CDN) | Full | ✅ Integrates with existing tools |
| Dropbox | $12/mo | Fast | Limited | ❌ Separate system |
| Google Drive | $10/mo | Slow | Limited | ❌ Separate system |
| WeTransfer | Free/Paid | Slow | None | ❌ Manual downloads |
| GitHub LFS | $5/mo | Slow | Limited | ⚠️ Git complexity |

**Why S3 wins**:
- ✅ Already using S3 for archival (roadmap.md)
- ✅ Same bucket, different prefix
- ✅ Integrates with video-asset-tools
- ✅ Programmable (Ruby SDK)
- ✅ Cheap for typical usage
- ✅ Fast global access (CloudFront optional)

---

## Implementation Plan

### Phase 1: Core Tools (Week 1)

**Day 1-2**: Setup
- [ ] Update `.gitignore` (remove `final/` exception, add `s3-staging/`)
- [ ] Create IAM users (david-video-projects, jan-video-projects)
- [ ] Configure bucket lifecycle (90-day cleanup for `staging/` prefix)
- [ ] Update `.video-tools.env` with S3 config

**Day 3-4**: Build tools
- [ ] Implement `s3_sync_up.rb`
- [ ] Implement `s3_sync_down.rb`
- [ ] Implement `s3_sync_status.rb`

**Day 5**: Testing
- [ ] Test with b65 (1.1GB file)
- [ ] Test with b66 (899MB file)
- [ ] Verify lifecycle cleanup works

---

### Phase 2: UAT with Jan (Week 2)

**Day 1**: Jan setup
- [ ] Jan installs AWS CLI
- [ ] Jan configures `.video-tools.env`
- [ ] Jan tests sync_down for b65

**Day 2-3**: Real workflow
- [ ] David uploads raw file
- [ ] Jan downloads, edits, uploads
- [ ] David downloads Jan's edits
- [ ] Test cleanup

**Day 4-5**: Documentation & refinement
- [ ] Document common issues
- [ ] Add error handling
- [ ] Update README.md

---

### Phase 3: Integration (Week 3)

**Integration with existing tools**:
- [ ] Update `generate_manifest.rb` to track S3 status
- [ ] Update `dashboard.html` to show S3 staging files
- [ ] Add S3 status to per-project manifest

**Optional enhancements**:
- [ ] Progress bars for large uploads
- [ ] Email/Slack notifications when files uploaded
- [ ] Automatic sync on file change (watchdog)

---

## Success Criteria

**Phase 1 Complete when**:
- ✅ Can upload 1GB+ file to S3
- ✅ Can download from S3
- ✅ Status tool shows accurate info
- ✅ Cleanup removes files from S3
- ✅ No video files pushed to GitHub

**Phase 2 Complete when**:
- ✅ Jan successfully downloads file David uploaded
- ✅ Jan successfully uploads edited file
- ✅ David receives Jan's edits
- ✅ Both comfortable with workflow

**Phase 3 Complete when**:
- ✅ Dashboard shows S3 staging status
- ✅ Manifest tracks S3 files
- ✅ 5+ projects using S3 staging successfully

---

## Risks & Mitigations

### Risk 1: AWS costs spiral

**Mitigation**:
- Set AWS billing alert at $10/month
- Lifecycle policy auto-deletes after 90 days
- Monitor usage weekly

### Risk 2: Files corrupted during upload/download

**Mitigation**:
- Use multipart upload for large files
- Verify checksums (MD5)
- Keep local copy until confirmed uploaded

### Risk 3: Jan can't access S3 from Philippines

**Mitigation**:
- Test connectivity first
- Use CloudFront if speed issues
- Fallback: WeTransfer for single large file

### Risk 4: Accidentally delete important files

**Mitigation**:
- Cleanup requires `--confirm` flag
- Warn before deletion
- Show file list before deleting
- Optional: Move to archive instead of delete

---

## Next Steps

1. **Immediate**: Fix `.gitignore` to prevent `final/` from being tracked
2. **Week 1**: Implement core S3 sync tools
3. **Week 2**: UAT testing with Jan
4. **Week 3**: Integration with existing tools

---

## Related Documentation

- `roadmap.md` - Overall S3/Glacier implementation plan
- `s3-integration-setup.md` - AWS S3 bucket and IAM setup
- `s3-desktop-tools-research.md` - Alternative tools (S3 Browser, CloudMounter)
- `../README.md` - Current video-asset-tools documentation

---

**Status**: Design complete, ready for implementation
**Next**: Fix .gitignore, implement s3_sync_up.rb
**Target**: Production-ready in 3 weeks
