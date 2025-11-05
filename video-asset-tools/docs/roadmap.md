# Video Asset Tools - Roadmap

**Version**: 1.0.0
**Status**: Active Development
**Last Updated**: 2025-11-03

---

## Overview

This roadmap outlines the evolution of video asset management from local SSD backup to cloud-based storage with team collaboration features.

**Current State**: Local + SSD backup workflow
**Future State**: Hybrid cloud storage with automated lifecycle management and team sync

---

## Phase 1: Current Implementation ✅ COMPLETE

### Local + SSD Backup Workflow

**Status**: ✅ Operational
**Location**: `v-shared/video-asset-tools/`

**Tools**:
- `generate_manifest.rb` - Scan and track projects across storage tiers
- `archive_project.rb` - Archive to SSD, delete local heavy files
- `sync_from_ssd.rb` - Pull back light files (transcripts, thumbnails)
- `dashboard.html` - Visualize project state

**Storage Tiers**:
1. **Local Flat** - Active projects (~8 projects, ~4GB)
2. **Local Archived** - Light files only (~102 projects, ~1.5GB)
3. **SSD Backup** - Full backups (~110 projects, ~400GB)

**Configuration**: `.video-tools.env` per repository

**Works For**: Single developer, local machine + external SSD

---

## Phase 2: S3 Long-Term Archival 🎯 NEXT

### Goal: Cloud Backup for Old Projects

Move completed projects from SSD to AWS S3 for:
- **Offsite backup** (disaster recovery)
- **SSD capacity management** (free up space for recent work)
- **Cost-effective storage** (S3/Glacier cheaper than buying more SSDs)

### Architecture: Storage Lifecycle

```
Active → SSD Backup → S3 Standard → S3 Glacier Deep Archive
(local)   (6 months)   (6-24 mo)     (1+ years)
```

**Retention Policy**:
- **Local**: Current 5-10 active projects
- **SSD**: Last 6 months of completed work (~100GB)
- **S3 Standard**: 6-24 months old (~100GB) - $2.30/month
- **Glacier**: 1+ years old (~200GB) - $0.20/month

**Cost Estimate** (for 400GB archive):
- Current: $0/month (SSD only, one-time hardware cost)
- Hybrid: ~$2.50/month (SSD + S3 + Glacier)

### New Tools Required

#### 1. `backup_to_s3.rb`
Upload project from SSD to S3 Standard.

```bash
# Upload single project
ruby bin/backup_to_s3.rb b40-old-project

# Upload all projects older than 6 months
ruby bin/backup_to_s3.rb --older-than 6months

# Delete from SSD after successful upload
ruby bin/backup_to_s3.rb b40-old-project --delete-local
```

**What it does**:
- Reads manifest to find SSD projects
- Compresses project folder (tar.gz)
- Uploads to S3: `s3://bucket/b00-b49/b40-old-project.tar.gz`
- Updates manifest with S3 location
- Optionally removes from SSD

#### 2. `archive_to_glacier.rb`
Move S3 Standard objects to Glacier Deep Archive.

```bash
# Transition projects older than 6 months in S3
ruby bin/archive_to_glacier.rb --older-than 6months

# Transition specific project
ruby bin/archive_to_glacier.rb b40-old-project
```

**What it does**:
- Uses S3 lifecycle policies OR manual transition API
- Updates manifest: `tier: "GLACIER"`
- Cheaper storage for rarely-accessed projects

#### 3. `restore_from_s3.rb`
Download project from S3/Glacier back to SSD or local.

```bash
# Restore from S3 Standard (immediate)
ruby bin/restore_from_s3.rb b40-old-project

# Restore from Glacier (12-48 hours)
ruby bin/restore_from_s3.rb b40-old-project --glacier
ruby bin/restore_from_s3.rb b40-old-project --check-status

# Restore to specific location
ruby bin/restore_from_s3.rb b40-old-project --to local
ruby bin/restore_from_s3.rb b40-old-project --to ssd
```

**What it does**:
- For S3 Standard: Immediate download
- For Glacier: Initiate retrieval request, wait 12-48 hours
- Downloads tar.gz and extracts to target location
- Updates manifest

#### 4. Updated `generate_manifest.rb`
Track S3/Glacier locations in manifest.

**Enhanced Manifest Structure**:
```json
{
  "id": "b40-old-project",
  "storage": {
    "local": { "exists": false },
    "ssd": { "exists": false },
    "s3": {
      "exists": true,
      "bucket": "appydave-video-archive",
      "key": "b00-b49/b40-old-project.tar.gz",
      "tier": "GLACIER",
      "size_bytes": 12453678,
      "uploaded_at": "2025-11-03T10:30:00Z",
      "transitioned_at": "2026-05-03T10:30:00Z"
    }
  }
}
```

#### 5. Updated `dashboard.html`
Visualize cloud storage status.

**New Features**:
- Fourth tab: "Cloud Storage"
- Show S3 vs Glacier tier
- Estimated monthly cost
- Retrieval status (for Glacier)

### Implementation Plan

**Week 1-2: Setup & Basic Upload**
- [ ] Install `aws-sdk-s3` gem
- [ ] Create `backup_to_s3.rb` script
- [ ] Test with 1-2 small projects
- [ ] Update manifest schema
- [ ] Update dashboard

**Week 3: Lifecycle & Automation**
- [ ] Configure S3 lifecycle policies (auto-transition to Glacier after 180 days)
- [ ] Create `archive_to_glacier.rb` for manual transitions
- [ ] Test lifecycle transitions

**Week 4: Retrieval & Validation**
- [ ] Create `restore_from_s3.rb` script
- [ ] Test Glacier retrieval flow
- [ ] Document retrieval times
- [ ] Cost validation

**Week 5: SSD Cleanup**
- [ ] Batch upload old projects to S3
- [ ] Delete from SSD after validation
- [ ] Monitor cost (AWS billing alerts)
- [ ] Update README with S3 workflows

### Prerequisites

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure

# Install Ruby AWS SDK
gem install aws-sdk-s3
```

### Configuration Updates

**Enhanced `.video-tools.env`**:
```bash
# SSD (existing)
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave

# AWS credentials (or use AWS_PROFILE)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# S3 configuration
S3_BUCKET=appydave-video-archive
S3_PREFIX=appydave/

# Glacier configuration
GLACIER_VAULT=appydave-long-term-archive

# Lifecycle rules
S3_RETENTION_DAYS=180          # Move to Glacier after 6 months
SSD_RETENTION_DAYS=90          # Delete from SSD after 3 months (if in S3)
```

### Cost Estimation Tool

**New Utility**: `utils/estimate_storage_costs.rb`

```bash
ruby utils/estimate_storage_costs.rb

# Output:
# 📊 Storage Cost Estimation (400GB total)
#
# Scenario 1: All S3 Standard
#   Monthly: $9.20 | Annual: $110.40
#
# Scenario 2: All Glacier Deep Archive
#   Monthly: $0.40 | Annual: $4.80
#
# Scenario 3: Hybrid (Recommended)
#   SSD (6mo):        100 GB - $0.00/mo
#   S3 Standard:      100 GB - $2.30/mo
#   Glacier (2yr+):   200 GB - $0.20/mo
#   ----------------------------------
#   Total:            400 GB - $2.50/mo ($30/year)
```

---

## Phase 3: S3 Team Collaboration Sync 🚀 PRIORITY

### Goal: David ↔ Jan File Sharing via S3

Enable two-way file sync between David (Thailand) and Jan (Philippines) using S3 as a staging area.

### Problem Statement

**Current Workflow**:
- David creates final video: `final/project-name-v1.mp4`
- Git tracks metadata, **ignores heavy video files**
- Jan can pull git repo but **doesn't get videos**
- Manual file transfer needed (Dropbox, WeTransfer, etc.)

**Desired Workflow**:
- David places file in `s3-staging/` folder
- Tool auto-uploads to S3
- Jan runs sync tool to download from S3
- Jan adds his files, uploads back
- David syncs down Jan's additions
- **Both can clean up when done**

### S3 Staging Folder Convention

Each project gets an `s3-staging/` subfolder:

```
project-name/
├── recordings/
├── assets/
├── final/                    # Tracked in git (final deliverables)
│   └── project-name-v1.mp4
├── s3-staging/               # NOT tracked in git (collaboration files)
│   ├── project-name-draft.mp4    # David's work-in-progress
│   ├── project-name-audio.wav    # Jan's audio edit
│   └── project-name-color.mp4    # Jan's color grade
└── data/
```

**Convention**:
- `s3-staging/` = Shared collaboration space
- Files here sync bidirectionally via S3
- Not tracked in git (too large)
- Temporary (deleted after project complete)

### S3 Bucket Structure

```
s3://appydave-video-collab/
├── v-appydave/
│   ├── b63-flivideo/
│   │   ├── project-name-draft.mp4
│   │   └── metadata.json         # Sync metadata
│   └── b64-project/
├── v-voz/
│   └── boy-baker/
└── v-aitldr/
    └── appydave-advert/
```

**Metadata JSON** (per project):
```json
{
  "project_id": "b63-flivideo",
  "repo": "v-appydave",
  "last_sync": "2025-11-03T14:30:00Z",
  "files": [
    {
      "name": "project-name-draft.mp4",
      "size_bytes": 45678901,
      "uploaded_by": "david",
      "uploaded_at": "2025-11-03T10:00:00Z",
      "md5": "abc123..."
    },
    {
      "name": "project-name-audio.wav",
      "size_bytes": 12345678,
      "uploaded_by": "jan",
      "uploaded_at": "2025-11-03T14:00:00Z",
      "md5": "def456..."
    }
  ]
}
```

### New Tools Required

#### 1. `s3_sync_up.rb`
Push local `s3-staging/` to S3.

```bash
# From project directory
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb

# Or specify project
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b63-flivideo

# Dry run (preview)
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb --dry-run
```

**What it does**:
1. Scans `s3-staging/` for files
2. Compares with S3 (checks MD5 hashes)
3. Uploads new/changed files only
4. Updates metadata.json on S3
5. Shows sync summary

**Output**:
```
🔼 Uploading to S3: v-appydave/b63-flivideo

  ✓ project-name-draft.mp4 (45.6 MB) - uploaded
  - project-name-audio.wav (12.3 MB) - already in sync

Summary:
  Uploaded: 1 file (45.6 MB)
  Skipped: 1 file (12.3 MB)
  Total time: 23s
```

#### 2. `s3_sync_down.rb`
Pull S3 files to local `s3-staging/`.

```bash
# From project directory
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb

# Or specify project
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb b63-flivideo

# Dry run
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb --dry-run
```

**What it does**:
1. Lists files in S3 for this project
2. Compares with local `s3-staging/` (MD5 hashes)
3. Downloads new/changed files only
4. Creates `s3-staging/` if missing
5. Shows sync summary

**Output**:
```
🔽 Downloading from S3: v-appydave/b63-flivideo

  ✓ project-name-audio.wav (12.3 MB) - downloaded
  - project-name-draft.mp4 (45.6 MB) - already in sync

Summary:
  Downloaded: 1 file (12.3 MB)
  Skipped: 1 file (45.6 MB)
  Total time: 8s
```

#### 3. `s3_sync_cleanup.rb`
Remove project's S3 staging files when done.

```bash
# Delete S3 staging files for project
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b63-flivideo

# Preview what will be deleted
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b63-flivideo --dry-run
```

**What it does**:
1. Lists all files in S3 for project
2. Prompts for confirmation
3. Deletes S3 files
4. Does NOT delete local `s3-staging/` (manual cleanup)

#### 4. `s3_sync_status.rb`
Show sync status for project(s).

```bash
# Current project status
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb

# Specific project
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb b63-flivideo

# All projects with S3 staging
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb --all
```

**Output**:
```
📊 S3 Staging Status: b63-flivideo

Local s3-staging/:
  project-name-draft.mp4  (45.6 MB) ✓ synced
  project-name-audio.wav  (12.3 MB) ✓ synced

S3 (s3://appydave-video-collab/v-appydave/b63-flivideo/):
  project-name-draft.mp4  (45.6 MB) ✓ synced
  project-name-audio.wav  (12.3 MB) ✓ synced

Status: ✅ In sync (last sync: 2 hours ago by jan)
```

### Workflow Examples

#### David's Workflow: Share Draft Video

```bash
# 1. Create draft video
cd v-appydave/b63-flivideo
mkdir -p s3-staging
cp final/flivideo-draft.mp4 s3-staging/

# 2. Upload to S3
ruby ../../v-shared/video-asset-tools/bin/s3_sync_up.rb

# 3. Notify Jan (Slack, Discord, etc.)
# "Jan - draft video uploaded to b63-flivideo s3-staging"
```

#### Jan's Workflow: Download, Edit, Upload Back

```bash
# 1. Pull latest from git
cd v-appydave
git pull

# 2. Download from S3
cd b63-flivideo
ruby ../../v-shared/video-asset-tools/bin/s3_sync_down.rb

# 3. Work on files
# Add audio, color grading, etc.
# Save outputs to s3-staging/

# 4. Upload back to S3
ruby ../../v-shared/video-asset-tools/bin/s3_sync_up.rb

# 5. Notify David
# "David - audio edit uploaded to b63-flivideo s3-staging"
```

#### David's Workflow: Get Jan's Work

```bash
# 1. Download Jan's additions
cd v-appydave/b63-flivideo
ruby ../../v-shared/video-asset-tools/bin/s3_sync_down.rb

# 2. Review Jan's work
open s3-staging/flivideo-audio.wav

# 3. Finalize and cleanup
cp s3-staging/flivideo-final.mp4 final/flivideo-v2.mp4
git add final/flivideo-v2.mp4
git commit -m "Final video with Jan's audio"

# 4. Clean up S3 staging
ruby ../../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b63-flivideo
rm -rf s3-staging/
```

### Technical Implementation

**AWS SDK Usage**:
```ruby
require 'aws-sdk-s3'
require 'digest'

s3 = Aws::S3::Client.new(
  region: ENV['AWS_REGION'],
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)

# Upload file
s3.put_object(
  bucket: 'appydave-video-collab',
  key: 'v-appydave/b63-flivideo/draft.mp4',
  body: File.read('s3-staging/draft.mp4'),
  metadata: {
    'uploaded-by' => 'david',
    'project-id' => 'b63-flivideo'
  }
)

# Download file
s3.get_object(
  bucket: 'appydave-video-collab',
  key: 'v-appydave/b63-flivideo/draft.mp4',
  response_target: 's3-staging/draft.mp4'
)

# List files
resp = s3.list_objects_v2(
  bucket: 'appydave-video-collab',
  prefix: 'v-appydave/b63-flivideo/'
)
```

**MD5 Hash Comparison** (skip unchanged files):
```ruby
def needs_upload?(local_file, s3_etag)
  local_md5 = Digest::MD5.file(local_file).hexdigest
  s3_md5 = s3_etag.gsub('"', '')
  local_md5 != s3_md5
end
```

### Configuration Updates

**Enhanced `.video-tools.env`**:
```bash
# Existing SSD config
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave

# AWS credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# S3 Archival (Phase 2)
S3_ARCHIVE_BUCKET=appydave-video-archive
S3_ARCHIVE_PREFIX=appydave/

# S3 Collaboration (Phase 3) - NEW
S3_COLLAB_BUCKET=appydave-video-collab
S3_COLLAB_PREFIX=                      # No prefix (repo name in key)
S3_SYNC_USER=david                     # Or 'jan'
```

**Updated `.gitignore`** (all repos):
```gitignore
# S3 staging folder (collaboration files)
s3-staging/
**/s3-staging/
```

### Cost Estimation

**Collaboration Storage** (per month):

| Scenario | Files | Size | S3 Cost | Transfer Out |
|----------|-------|------|---------|--------------|
| Light use | 5 projects × 2 files | 500 MB | $0.01 | $0.05 (1GB) |
| Medium use | 10 projects × 5 files | 5 GB | $0.12 | $0.50 (10GB) |
| Heavy use | 20 projects × 10 files | 50 GB | $1.15 | $5.00 (100GB) |

**Notes**:
- Storage: $0.023/GB/month (S3 Standard)
- Transfer OUT: $0.05/GB (Thailand/Philippines to Internet)
- Transfer IN: FREE
- Cleanup after each project keeps costs low

**Budget Approach**:
- Start free tier (5GB storage, 20K GET requests, 2K PUT requests)
- Monitor for 1 month
- Propose costs to David before scaling

### Implementation Plan

**Week 1: Setup & Basic Sync**
- [ ] Create S3 bucket: `appydave-video-collab`
- [ ] Configure bucket policy (David + Jan access)
- [ ] Create `s3_sync_up.rb` (upload)
- [ ] Create `s3_sync_down.rb` (download)
- [ ] Test with 1 small file

**Week 2: Metadata & Optimization**
- [ ] Add metadata.json tracking
- [ ] Implement MD5 hash checking (skip unchanged files)
- [ ] Add progress bars for large files
- [ ] Test with realistic video files (1-5GB)

**Week 3: Status & Cleanup**
- [ ] Create `s3_sync_status.rb`
- [ ] Create `s3_sync_cleanup.rb`
- [ ] Update `.gitignore` in all repos
- [ ] Document workflows in README

**Week 4: UAT with Jan**
- [ ] Jan sets up `.video-tools.env` with his AWS credentials
- [ ] Test full David → Jan → David workflow
- [ ] Monitor costs (AWS billing)
- [ ] Refine based on feedback

### Advantages Over Other Solutions

| Solution | Pros | Cons |
|----------|------|------|
| **Dropbox/Google Drive** | Simple, visual UI | Costs $12-20/mo, manual upload/download |
| **WeTransfer** | Free for <2GB | Expires after 7 days, manual each time |
| **Git LFS** | Version control for binaries | Expensive ($5/50GB/mo), slow |
| **S3 Staging** ✅ | Pay-as-you-go (~$1-2/mo), automated, scriptable | Requires AWS setup, CLI tools |

---

## Phase 4: Automated Workflows 🤖 FUTURE

### Goal: Hands-Free Lifecycle Management

Automate the entire storage lifecycle based on project age and access patterns.

### Features

**Auto-Archival Based on Age**:
- Projects older than 90 days → Auto-archive to SSD
- SSD projects older than 180 days → Auto-upload to S3
- S3 projects older than 365 days → Auto-transition to Glacier

**Smart Restore**:
- Detect when user references old project
- Auto-initiate Glacier retrieval if needed
- Notify when ready (Slack, email)

**Cost Optimization**:
- Delete from SSD after S3 upload (validation required)
- Automatic S3 lifecycle policies (no manual transitions)
- Monthly cost report

**New Tools**:
- `auto_archive_daemon.rb` - Background process watching for old projects
- `smart_restore.rb` - Predictive restoration based on access patterns
- `cost_reporter.rb` - Monthly AWS bill breakdown

**Cron Jobs**:
```bash
# Daily: Archive old projects
0 2 * * * cd /path/to/v-appydave && ruby ../v-shared/video-asset-tools/bin/auto_archive_daemon.rb

# Weekly: Upload SSD to S3
0 3 * * 0 cd /path/to/v-appydave && ruby ../v-shared/video-asset-tools/bin/backup_to_s3.rb --older-than 180days

# Monthly: Cost report
0 9 1 * * ruby /path/to/v-shared/video-asset-tools/bin/cost_reporter.rb --email david@appydave.com
```

---

## Success Metrics

### Phase 1 (Complete) ✅
- [x] 110 projects tracked in manifest
- [x] 8 active local projects
- [x] 102 archived projects (light files only)
- [x] 400GB backed up to SSD
- [x] Dashboard visualizes all locations

### Phase 2 (S3 Archival)
- [ ] 50+ projects uploaded to S3
- [ ] 20+ projects in Glacier
- [ ] SSD freed up by 50% (200GB → S3)
- [ ] Monthly cost < $5
- [ ] Restore tested and documented

### Phase 3 (Team Collaboration) 🎯 PRIORITY
- [ ] David ↔ Jan successfully exchange 5 files via S3
- [ ] Round-trip latency < 5 minutes (upload → notify → download)
- [ ] Zero file loss (MD5 validation)
- [ ] Monthly cost < $2
- [ ] Both users comfortable with CLI tools

### Phase 4 (Automation)
- [ ] Zero manual archival for 30 days
- [ ] Auto-archive runs nightly without errors
- [ ] Cost optimization saves 30% vs manual workflow
- [ ] Email reports delivered monthly

---

## Risk Mitigation

### Risk 1: S3 Costs Spiral
**Mitigation**:
- Start with 1-2 test projects
- Set AWS billing alerts ($5, $10, $20 thresholds)
- Monitor for 1 month before scaling
- Document actual costs vs estimates

### Risk 2: Glacier Retrieval Too Slow
**Mitigation**:
- Keep recent 6 months on SSD (immediate access)
- Use S3 Standard for 6-24 months (instant retrieval)
- Only deep archive 2+ year old projects
- Plan ahead for any needed restores

### Risk 3: S3 Sync Conflicts (David + Jan Edit Same File)
**Mitigation**:
- Use metadata.json to track "last uploaded by"
- Show warning if file newer on S3 than local
- Naming convention: `file-david.mp4`, `file-jan.mp4` for parallel work
- Communication protocol (Slack notifications)

### Risk 4: AWS Credentials Leak
**Mitigation**:
- `.video-tools.env` in `.gitignore` (never commit)
- Use IAM roles with minimal permissions (S3 only)
- Rotate credentials quarterly
- Monitor CloudTrail for unauthorized access

---

## Next Steps

**Immediate** (This Week):
1. ✅ Complete Phase 1 migration
2. 🎯 **Implement Phase 3 (S3 Collaboration)** - Priority for David/Jan workflow
3. Document S3 setup in UAT guide

**Short Term** (Next Month):
1. Create `s3_sync_up.rb` and `s3_sync_down.rb`
2. Test with Jan on real project
3. Monitor costs (free tier should cover initial testing)

**Medium Term** (Next Quarter):
1. Implement Phase 2 (S3 Archival) after collaboration proven
2. Batch upload old projects to S3
3. Free up SSD space

**Long Term** (Next Year):
1. Implement Phase 4 (Automation)
2. Glacier archival for 2+ year old projects
3. Consider multi-region replication (disaster recovery)

---

**Document Status**: Active Roadmap
**Owner**: David Cruwys
**Contributors**: Jan (Philippines), Claude Code
**Next Review**: After Phase 3 UAT Complete
