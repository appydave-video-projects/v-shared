# VAM S3 Staging - Quick Start Guide

**Purpose**: Get started with S3 staging for David ↔ Jan collaboration
**Updated**: 2025-11-03

---

## Read This First (In Order)

### 1. Context & Design (15 minutes)
📄 **[vam-s3-staging-design.md](./vam-s3-staging-design.md)** - Product Requirements Document

**What you'll learn**:
- Problem: GitHub can't handle 1GB+ files (b65, b66)
- Solution: S3 staging for temporary collaboration
- Clarification: This is **NOT** for archival/backup (that's T7 drive + future Glacier)
- Tool specs: 4 new Ruby tools (sync_up, sync_down, status, cleanup)
- Workflows: How David and Jan will use this
- Timeline: 3-week implementation

**Key takeaway**: S3 staging = temporary cloud sync for active projects only

---

### 2. Implementation Details (10 minutes)
📄 **[s3-integration-setup.md](./s3-integration-setup.md)** - Technical Setup Guide

**What you'll learn**:
- AWS S3 bucket configuration
- Bucket name: `video-projects` (corrected from "appydave-video-projects")
- IAM policy and user setup
- Lifecycle rules (90-day auto-delete)
- Cost estimates ($2-5/month)

**Key takeaway**: 30-minute manual AWS setup required before coding

---

### 3. Current Status (5 minutes)
📄 **[vam-s3-status.md](./vam-s3-status.md)** - Implementation Status

**What you'll learn**:
- What's complete: Phase 1 (SSD backup) - 100% working
- What's planned: Phase 3 (S3 staging) - PRDs complete, AWS setup pending
- Next steps: AWS setup → Tool development (Week 1-3)
- Decision points: Architecture approved (single bucket)

**Key takeaway**: Ready to start AWS setup, then build tools

---

## Optional Reading

### Terminology Clarification (5 minutes)
📄 **[vam-s3-terminology.md](./vam-s3-terminology.md)**

**Read this if confused about**:
- Difference between staging, archive, and Glacier
- Why S3 is NOT for long-term storage
- Your actual workflow mapped out

---

### Architecture Decision (10 minutes)
📄 **[vam-s3-aws-architecture.md](./vam-s3-aws-architecture.md)**

**Read this if you want to know**:
- Why single bucket vs per-business-unit buckets
- How tools auto-detect brand from directory path
- Cost tracking per business unit
- When to split buckets in the future

---

### Desktop Tools Research (5 minutes)
📄 **[s3-desktop-tools-research.md](./s3-desktop-tools-research.md)**

**Read this if you want**:
- GUI alternatives to AWS CLI (S3 Browser, CloudMounter)
- Desktop tool comparison
- When to use GUI vs command-line

---

## Implementation Checklist

### Phase 1: AWS Setup (30 minutes) - David
- [ ] Read PRD ([vam-s3-staging-design.md](./vam-s3-staging-design.md))
- [ ] Read setup guide ([s3-integration-setup.md](./s3-integration-setup.md))
- [ ] Create S3 bucket: `video-projects`
- [ ] Configure lifecycle rule: `staging/` → delete 90 days
- [ ] Create IAM policy: `video-projects-full-access`
- [ ] Create IAM user: `david-video-projects`
- [ ] Generate access keys
- [ ] Save credentials to `.video-tools.env`
- [ ] Test AWS CLI access

### Phase 2: Tool Development (Week 1-2) - David or Claude
- [ ] Build `s3_sync_up.rb`
- [ ] Build `s3_sync_down.rb`
- [ ] Build `s3_sync_status.rb`
- [ ] Build `s3_sync_cleanup.rb`
- [ ] Test with b65 (1.1GB) and b66 (899MB)

### Phase 3: UAT Testing (Week 2) - David + Jan
- [ ] Create IAM user: `jan-video-projects`
- [ ] Send Jan his credentials
- [ ] Jan configures `.video-tools.env`
- [ ] Test: David upload → Jan download
- [ ] Test: Jan upload → David download
- [ ] Test: Cleanup workflow

### Phase 4: Integration (Week 3) - David or Claude
- [ ] Update `generate_manifest.rb` to track S3
- [ ] Update `dashboard.html` to show S3 files
- [ ] Update README.md with S3 workflows
- [ ] Test across all brands (appydave, voz, aitldr)

---

## Quick Reference

### Bucket Information
- **Name**: `video-projects`
- **Region**: us-east-1 (or ap-southeast-1)
- **Purpose**: Active collaboration (temporary storage)
- **Structure**: `s3://video-projects/staging/v-{brand}/{project}/`
- **Lifecycle**: Auto-delete after 90 days

### Cost Estimate
- **Typical usage**: $2-5/month (20-50GB active)
- **Per-project**: ~$0.10-0.50/month per active project

### Commands (Future)
```bash
# Upload to S3
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65

# Download from S3
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb b65

# Check status
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb b65

# Clean up
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b65 --confirm
```

---

## Problem Being Solved

### Current Issues
1. ❌ b65 has 1.1GB raw file in `final/` - can't push to GitHub
2. ❌ b66 has 899MB raw file in `final/` - can't push to GitHub
3. ❌ Jan can't access files David creates (e.g., Gling AI exports)
4. ❌ `.gitignore` has exception for `final/` causing tracking issues

### Solution
1. ✅ Create `s3-staging/` folder in each project
2. ✅ Upload large files to S3 instead of GitHub
3. ✅ Jan downloads from S3, edits, uploads back
4. ✅ David downloads Jan's edits
5. ✅ Clean up S3 when project complete (or auto-delete 90 days)

---

## Success Criteria

### Week 1 Success
- ✅ David can upload 1GB+ file to S3
- ✅ David can download file from S3
- ✅ No video files pushed to GitHub
- ✅ Tools work for all brands (appydave, voz, aitldr)

### Week 2 Success
- ✅ Jan successfully downloads file David uploaded
- ✅ Jan successfully uploads edited file
- ✅ David receives Jan's edits
- ✅ Status tool shows accurate sync state

### Week 3 Success
- ✅ Dashboard shows S3 staging files
- ✅ Manifest tracks S3 status
- ✅ Documentation complete
- ✅ Production-ready

---

## Next Action

**👉 Start here**: Create AWS S3 bucket (30 minutes)

Follow the setup guide in [s3-integration-setup.md](./s3-integration-setup.md) starting at "Step 1: Create S3 Bucket"

---

**Created**: 2025-11-03
**Status**: Ready for AWS setup
**Blocker**: None - can start immediately
