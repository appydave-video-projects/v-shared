# S3 Desktop Tools Research

**Purpose**: Research on desktop GUI tools for managing Amazon S3 buckets
**Context**: Need to move large video files (1GB+) between David (Thailand) and Jan (Philippines)
**Date**: 2025-11-03
**Status**: Research phase - evaluating options

---

## Use Case Requirements

### Multi-User Sync Workflow

**Scenario**: David and Jan collaborating on video projects via S3 as shared storage

**Flow**:
1. **David uploads**: Places video in `s3-final/` or `final/` folder → tool uploads to S3
2. **Jan downloads**: Pulls S3 folder to his local machine (Git has metadata, S3 has heavy files)
3. **Jan uploads additions**: Pushes his edits/additions back to S3
4. **David pulls updates**: Gets Jan's changes from S3
5. **Cleanup**: When done, move finals back to local, delete from S3

**Key Requirements**:
- Large file support (1GB+ videos, multipart upload)
- Two-way sync (David ↔ S3 ↔ Jan)
- Folder hierarchy support (S3 prefixes)
- Cross-platform (macOS for David, Windows for Jan)
- Automation-friendly (can script or integrate with existing workflows)

---

## Evaluated Tools

### 1. S3 Browser (Windows Only)

**Website**: https://s3browser.com/

**Pros**:
- Dedicated Windows client for S3
- Drag & drop from Windows Explorer
- Multi-account support
- Large file multipart uploads (up to 5TB)
- Versioning support
- Mature product

**Cons**:
- ❌ Windows-only (David on macOS can't use)
- GUI tool (limits scripting/automation)

**Best for**: Jan's side (Windows)

---

### 2. CloudMounter (Windows & macOS)

**Website**: https://cloudmounter.net/

**Pros**:
- ✅ Cross-platform (Mac + Windows)
- Mounts S3 as local drive (File Explorer/Finder)
- Browse/edit like local files
- Multiple AWS accounts support
- S3-compatible storage support

**Cons**:
- Performance depends on network/bucket size
- Freemium model (check licensing for full features)
- Drive-mounting may have latency for large operations

**Best for**: Both David and Jan if simplicity is priority

---

### 3. WinSCP for S3 (Windows Only)

**Website**: https://winscp.net/

**Pros**:
- Free file-transfer GUI tool
- Supports S3 + FTP/SFTP
- Good for existing WinSCP users

**Cons**:
- ❌ Windows-only
- More "file transfer" than "bucket manager"
- Less S3-specific features (versioning, lifecycle)

**Best for**: Jan if already using WinSCP

---

### 4. Bucket UI (macOS + Windows)

**Website**: https://bucketui.com/

**Pros**:
- ✅ Cross-platform
- Unified dashboard for buckets across accounts/regions
- File previews, edit text files in-place
- Real-time updates
- Freemium model

**Cons**:
- Less well-known (smaller community/support)
- Performance for large transfers needs verification

**Best for**: Evaluation candidate for both users

---

## AWS CLI (Command Line)

**Not covered in ChatGPT convo, but critical option**

**Pros**:
- ✅ Cross-platform (Mac, Windows, Linux)
- ✅ Automation-friendly (scripting)
- ✅ Free (official AWS tool)
- Powerful sync commands: `aws s3 sync local-dir s3://bucket/prefix`
- Delete sync: `aws s3 sync --delete` (removes files not in source)

**Cons**:
- Command-line only (no GUI)
- Steeper learning curve for non-technical users

**Best for**: David's automation workflows

**Commands**:
```bash
# Upload to S3
aws s3 sync ./s3-final/ s3://appydave-video-collab/v-appydave/b63-project/

# Download from S3
aws s3 sync s3://appydave-video-collab/v-appydave/b63-project/ ./s3-final/

# Cleanup (delete from S3)
aws s3 rm s3://appydave-video-collab/v-appydave/b63-project/ --recursive
```

---

## Recommendation

### Hybrid Approach

**For David (macOS, automation-focused)**:
- Primary: **AWS CLI** for scripting automation
- Backup: **CloudMounter** for quick visual checks

**For Jan (Windows, GUI-focused)**:
- Primary: **S3 Browser** (mature Windows client)
- Alternative: **CloudMounter** (if wants cross-platform consistency)

**Why Hybrid?**:
- David already building automation tools (Ruby scripts for video-asset-tools)
- Jan may prefer GUI for ad-hoc file management
- AWS CLI is free, official, and integrates with existing workflows

---

## S3 Bucket Structure

### Proposed Hierarchy

```
s3://appydave-video-collab/
├── v-appydave/
│   ├── b63-flivideo/
│   │   ├── final/
│   │   │   └── flivideo-v1.mp4
│   │   └── assets/
│   │       └── thumbnail.png
│   └── b64-next-project/
│       └── ...
├── v-voz/
│   └── boy-baker/
│       └── ...
└── v-aitldr/
    └── ...
```

**Note**: S3 uses flat key-value structure, but `/` creates "folder-like" prefixes for organization

---

## Integration with Existing Workflow

### Current Setup (video-asset-tools)
- `generate_manifest.rb` - Tracks projects.json
- `sync_from_ssd.rb` - Pulls light files from T7 SSD
- `archive_project.rb` - Archives to SSD

### Proposed S3 Tools (Phase 3 - see roadmap.md)
- `s3_sync_up.rb` - Upload to S3 collaboration bucket
- `s3_sync_down.rb` - Download from S3
- `s3_sync_cleanup.rb` - Delete from S3 when done
- `s3_sync_status.rb` - Check what's in S3 vs local

**Implementation**: Use AWS SDK for Ruby (`aws-sdk-s3` gem)

---

## Cost Considerations

### AWS S3 Pricing (Collaboration Use Case)

**Scenario**: 100GB active collaboration files

**Monthly Costs**:
- Storage: 100GB × $0.023 = **$2.30/month**
- PUT requests: 100 files × $0.005/1000 = **$0.0005**
- GET requests: 100 downloads × $0.0004/1000 = **$0.00004**
- Transfer OUT (Thailand): 100GB × $0.09 = **$9.00/month**

**Total**: ~$11.30/month for 100GB active use

**Optimization**:
1. Delete from S3 after project complete (not long-term storage)
2. Compress videos before upload (50% size reduction)
3. Lifecycle rule: auto-delete 90-day-old files
4. Typical usage: 5-10 active projects = **$2-5/month**

---

## Security Best Practices

### IAM Setup
- **Separate IAM users**: `david-video-collab`, `jan-video-collab`
- **Minimal permissions**: Only S3 operations (no EC2, Lambda, etc.)
- **Access keys**: Store in `.video-tools.env` (gitignored)

### Bucket Security
- **Block public access**: ✅ Enabled
- **Encryption**: SSE-S3 (Amazon-managed keys)
- **Versioning**: ❌ Disabled (we manage versions via Git)

### Credential Management
- ❌ Don't commit AWS keys to Git
- ❌ Don't share keys via email/Slack
- ✅ Use environment files (`.video-tools.env`)
- ✅ Rotate keys every 90 days

---

## Next Steps

### Phase 1: Research ✅ (This document)
- [x] Evaluate desktop tools
- [x] Understand S3 bucket structure
- [x] Cost analysis

### Phase 2: UAT Testing (Immediate)
- [ ] Create S3 collaboration bucket: `appydave-video-collab`
- [ ] Create IAM users (david, jan) with policies
- [ ] Test AWS CLI sync commands
- [ ] Test CloudMounter (optional, for GUI fallback)

### Phase 3: Automation (see roadmap.md)
- [ ] Implement `s3_sync_up.rb` (Ruby)
- [ ] Implement `s3_sync_down.rb` (Ruby)
- [ ] Implement cleanup tools
- [ ] Update manifest tracking to include S3 status

---

## Related Documentation

- `s3-integration-setup.md` - Complete AWS setup guide (buckets, IAM, policies)
- `s3-setup-uat.md` - AI model testing S3 setup (different use case)
- `../video-asset-tools/docs/roadmap.md` - Phase 3 team collaboration plans

---

**Source**: ChatGPT conversations (2025-11-03)
**Last Updated**: 2025-11-03
**Status**: Research complete, ready for UAT testing
