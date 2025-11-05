# S3 Integration Setup - Video Asset Tools

**Purpose**: Configure AWS S3 for video project storage (archival + collaboration)
**Status**: Planning phase (not yet implemented)
**Related**: See `roadmap.md` for full implementation plans

---

## Overview

This guide covers S3 setup using a **single bucket** with organized folders:

- **`archive/`** - Long-term archival (with Glacier lifecycle)
- **`staging/`** - Team collaboration (David ↔ Jan file sync) 🎯

**Important**: This is different from `ai-model-research/s3-setup-uat.md` which is for AI-generated video testing.

---

## S3 Bucket Structure

### Single Bucket Organization

```
s3://video-projects/
├── archive/                    # Phase 2: Long-term archival
│   ├── appydave/
│   │   ├── a00-a49/
│   │   │   ├── a12-old-project.tar.gz
│   │   │   └── a45-ancient-project.tar.gz
│   │   ├── b00-b49/
│   │   │   └── b40-archived-project.tar.gz
│   │   └── b50-b99/
│   │       └── b63-flivideo.tar.gz
│   ├── voz/
│   │   └── boy-baker/
│   │       └── boy-baker-archive.tar.gz
│   └── manifest.json
│
└── staging/                    # Phase 3: Team collaboration
    ├── v-appydave/
    │   ├── b63-flivideo/
    │   │   ├── draft-v1.mp4
    │   │   ├── audio-edit.wav
    │   │   └── metadata.json
    │   └── b64-next-project/
    │       └── ...
    ├── v-voz/
    │   └── boy-baker/
    │       └── ...
    └── v-aitldr/
        └── ...
```

**Key Points**:
- `/archive/` has lifecycle rules (auto-transition to Glacier after 180 days)
- `/staging/` stays in S3 Standard (active collaboration), auto-deletes after 90 days
- One bucket, two purposes, organized by folders

---

## Storage Tiers

```
┌─────────────┐
│ Local Flat  │ Active projects (5-10 projects, ~4GB)
└──────┬──────┘
       │ archive_project.rb
       ↓
┌─────────────┐
│ SSD Backup  │ Recent completed (6 months, ~100GB)
└──────┬──────┘
       │ backup_to_s3.rb (Phase 2)
       ↓
┌─────────────────────────────────┐
│ S3: video-projects/    │
│  ├── archive/  (Glacier after   │ Long-term archival
│  │              180 days)        │ (~200GB)
│  └── staging/  (90-day cleanup)  │ Active collaboration
└─────────────────────────────────┘ (~20GB)
```

---

## Collaboration Flow (Phase 3)

```
David's Machine              S3 Staging Folder              Jan's Machine
┌──────────────┐             ┌────────────────┐            ┌──────────────┐
│ s3-staging/  │             │ staging/       │            │ s3-staging/  │
│  draft.mp4   │─sync_up────>│  v-appydave/   │─sync_down─>│  draft.mp4   │
│              │             │   b63-project/ │            │  audio.wav   │
│  audio.wav   │<─sync_down──│                │<─sync_up───│              │
└──────────────┘             └────────────────┘            └──────────────┘
```

---

## Setup Instructions

### Prerequisites

- AWS account with admin access
- AWS CLI installed: `brew install awscli` (Mac) or `choco install awscli` (Windows)
- Ruby `aws-sdk-s3` gem: `gem install aws-sdk-s3`

### Step 1: Create S3 Bucket

**Bucket name**: `video-projects`

**Settings**:
- **Region**: `us-east-1` (or closest to you)
- **Block public access**: ✅ Enabled (keep private)
- **Versioning**: ❌ Disabled (we manage versions via Git)
- **Encryption**: ✅ SSE-S3 (Amazon-managed keys)
- **Object Lock**: ❌ Disabled

---

### Step 2: Configure Lifecycle Rules

**Two separate lifecycle rules for different folders**:

#### Rule 1: Archive Folder → Glacier Transition
```json
{
  "Rules": [
    {
      "Id": "ArchiveToGlacier",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "archive/"
      },
      "Transitions": [
        {
          "Days": 180,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
```

#### Rule 2: Staging Folder → Auto-Delete
```json
{
  "Rules": [
    {
      "Id": "CleanupStaging",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "staging/"
      },
      "Expiration": {
        "Days": 90
      }
    }
  ]
}
```

**Why separate rules?**
- Archive needs Glacier transition (cost savings)
- Staging needs cleanup (prevent clutter)

---

### Step 3: Create IAM Policy

**Policy name**: `video-projects-s3-policy`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::video-projects"
    },
    {
      "Sid": "ManageObjects",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:RestoreObject",
        "s3:GetObjectMetadata",
        "s3:PutObjectMetadata"
      ],
      "Resource": "arn:aws:s3:::video-projects/*"
    }
  ]
}
```

---

### Step 4: Create IAM Users

**User 1**: `david-video-projects`
- Attach policy: `video-projects-s3-policy`
- Generate access keys → David's `.video-tools.env`

**User 2**: `jan-video-projects`
- Attach policy: `video-projects-s3-policy`
- Generate access keys → Jan's `.video-tools.env`

**Why separate users?**
- Track who uploaded what (via metadata)
- Can revoke access individually
- Audit trail for troubleshooting

---

## Configuration Files

### David's `.video-tools.env` (v-appydave/)

```bash
# SSD Backup (existing)
SSD_BASE=/Volumes/T7/youtube-PUBLISHED/appydave

# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# S3 Bucket (single bucket for both uses)
S3_BUCKET=video-projects

# Phase 2: Archival prefix
S3_ARCHIVE_PREFIX=archive/appydave/

# Phase 3: Collaboration prefix 🎯
S3_STAGING_PREFIX=staging/v-appydave/
S3_SYNC_USER=david

# Lifecycle Rules
S3_ARCHIVE_GLACIER_DAYS=180    # Archive → Glacier after 6 months
S3_STAGING_CLEANUP_DAYS=90     # Staging → Delete after 3 months
SSD_RETENTION_DAYS=90          # Delete from SSD after 3 months (if in S3)
```

### Jan's `.video-tools.env` (v-appydave/)

```bash
# SSD Backup (Jan's Windows path)
SSD_BASE=/d/T7/youtube-PUBLISHED/appydave

# AWS Credentials (Jan's IAM user)
AWS_ACCESS_KEY_ID=AKIA...      # jan-video-projects keys
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# S3 Bucket (same bucket, different user)
S3_BUCKET=video-projects

# Phase 3: Collaboration prefix 🎯
S3_STAGING_PREFIX=staging/v-appydave/
S3_SYNC_USER=jan
```

---

## Cost Estimates

### Single Bucket Breakdown

**Archival Storage** (archive/ folder, 400GB total):
- SSD (6 months): 100GB - $0/month (hardware cost)
- S3 Standard (first 6 months): 100GB × $0.023 = $2.30/month
- Glacier (after 6 months): 200GB × $0.001 = $0.20/month
- **Archival subtotal**: $2.50/month

**Collaboration Storage** (staging/ folder, ~20GB active):
- Storage: 20GB × $0.023 = $0.46/month
- PUT requests: 100 files × $0.005/1000 = $0.0005
- GET requests: 100 downloads × $0.0004/1000 = $0.00004
- Transfer OUT (to Thailand): 20GB × $0.09 = $1.80/month
- **Collaboration subtotal**: ~$2.26/month

**Total Monthly Cost**: ~$4.76/month (archival + collaboration in one bucket)

**Cost optimization**:
1. Clean up staging/ when projects complete
2. Compress videos before upload (50% size reduction)
3. Lifecycle auto-cleanup prevents forgotten files
4. Typical usage: 5-10 active projects in staging = ~$2-3/month total

---

## Security Best Practices

### ✅ DO:
- Keep `.video-tools.env` gitignored
- Use IAM users with minimal permissions
- Enable S3 bucket encryption (SSE-S3)
- Block all public access
- Rotate access keys every 90 days
- Use separate IAM users for David/Jan (audit trail)
- Enable CloudTrail logging (who accessed what)

### ❌ DON'T:
- Don't commit AWS credentials to git
- Don't use root account credentials
- Don't make bucket public
- Don't share access keys via email/Slack
- Don't give broader permissions than needed
- Don't disable encryption

---

## Testing Checklist

### Phase 2: Archival
- [ ] S3 bucket created: `video-projects`
- [ ] IAM policy created with correct permissions
- [ ] IAM users created (david, jan)
- [ ] Lifecycle policy configured (archive/ → Glacier after 180 days)
- [ ] `.video-tools.env` configured with credentials
- [ ] Test upload 1 small project to `archive/` (< 1GB)
- [ ] Verify file appears in S3 console under correct prefix
- [ ] Wait 24 hours, check lifecycle status (optional)
- [ ] Test restore from S3
- [ ] Monitor AWS bill after 1 week

### Phase 3: Collaboration
- [ ] Lifecycle policy set (staging/ → delete after 90 days)
- [ ] Both David and Jan have `.video-tools.env` configured
- [ ] Test: David uploads file to `staging/v-appydave/b63-test/` → Jan downloads
- [ ] Test: Jan uploads file → David downloads
- [ ] Test: Check metadata tracking
- [ ] Test: Cleanup removes files from S3
- [ ] Monitor costs after 1 month

---

## Troubleshooting

### "Access Denied" Error
**Cause**: IAM permissions incorrect

**Fix**:
1. Check IAM user has policy attached
2. Verify bucket name in policy matches actual bucket
3. Check region matches (bucket region = IAM policy region)

### "Bucket does not exist"
**Cause**: Bucket name mismatch or wrong region

**Fix**:
1. Verify `S3_BUCKET` in `.video-tools.env`
2. Check bucket exists in S3 console
3. Verify `AWS_REGION` matches bucket region

### Upload Fails with Large Files (>5GB)
**Cause**: Need multipart upload for files >5GB

**Fix**: Use `aws-sdk-s3` multipart upload (implemented in tools)

### Glacier Retrieval Too Slow
**Cause**: Glacier Deep Archive takes 12-48 hours

**Options**:
1. Use S3 Standard for recent projects (instant access)
2. Plan ahead when restoring old projects
3. Use Glacier Expedited retrieval ($0.03/GB, 1-5 minutes) for urgent needs

---

## Implementation Status

### Phase 2: Archival
- [ ] S3 bucket setup (this guide)
- [ ] `backup_to_s3.rb` tool
- [ ] `restore_from_s3.rb` tool
- [ ] Update `generate_manifest.rb` to track S3 locations
- [ ] Update `dashboard.html` to show S3 status

**Status**: Planning phase (see `roadmap.md` for full plan)

### Phase 3: Collaboration 🎯 PRIORITY
- [ ] S3 bucket setup (this guide)
- [ ] `s3_sync_up.rb` tool
- [ ] `s3_sync_down.rb` tool
- [ ] `s3_sync_cleanup.rb` tool
- [ ] `s3_sync_status.rb` tool
- [ ] UAT testing with Jan

**Status**: Planning phase (see `roadmap.md` for full plan)

---

## Next Steps

1. **Immediate**: Review this setup guide
2. **Week 1**: Create S3 bucket with lifecycle rules
3. **Week 2**: Implement `s3_sync_up.rb` and `s3_sync_down.rb`
4. **Week 3**: UAT test with Jan
5. **Month 2**: Implement Phase 2 (archival) after collaboration proven

---

## Related Documentation

- `roadmap.md` - Full implementation plan for both phases
- `s3-desktop-tools-research.md` - Desktop GUI tools for S3 management (S3 Browser, CloudMounter, AWS CLI)
- `../README.md` - Current tool usage (SSD backup)
- `/ai-model-research/s3-setup-uat.md` - AI testing S3 setup (different use case)

---

**Last Updated**: 2025-11-03
**Status**: Planning / Setup guide ready
**Next Action**: Create S3 bucket and configure lifecycle rules
