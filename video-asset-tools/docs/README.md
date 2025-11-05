# Video Asset Tools - Documentation Index

**Purpose**: Central index for all video-asset-tools documentation
**Updated**: 2025-11-03

---

## Quick Start

**Working Now** (Phase 1):
- [Main README](../README.md) - SSD backup workflow
- Generate manifest: `ruby bin/generate_manifest.rb`
- View dashboard: `open bin/dashboard.html`

**Coming Soon** (Phase 3):
- S3 staging for David ↔ Jan collaboration
- See PRDs below for details

---

## Documentation Structure

### Core Documentation
| Document | Purpose | Status |
|----------|---------|--------|
| [README.md](../README.md) | Main tool documentation (SSD workflow) | ✅ Complete |
| [roadmap.md](./roadmap.md) | All phases overview | ✅ Complete |

### S3 Staging PRDs (Phase 3)
| Document | Purpose | Status |
|----------|---------|--------|
| [vam-s3-status.md](./vam-s3-status.md) | **START HERE** - Completed vs planned work | ✅ Complete |
| [vam-s3-staging-design.md](./vam-s3-staging-design.md) | Main PRD - Tool specs, workflows, implementation | ✅ Complete |
| [vam-s3-aws-architecture.md](./vam-s3-aws-architecture.md) | Multi-business unit strategy, AWS setup guide | ✅ Complete |
| [vam-s3-terminology.md](./vam-s3-terminology.md) | Staging vs archive vs glacier clarification | ✅ Complete |

### S3 Integration Guides
| Document | Purpose | Status |
|----------|---------|--------|
| [s3-integration-setup.md](./s3-integration-setup.md) | AWS S3 bucket and IAM setup guide | ✅ Complete |
| [s3-desktop-tools-research.md](./s3-desktop-tools-research.md) | Desktop GUI tools (S3 Browser, CloudMounter) | ✅ Complete |

---

## Reading Order

### For Implementation (Start to Finish)

**Understanding the System**:
1. Read [vam-s3-terminology.md](./vam-s3-terminology.md) - Clarify staging/archive/glacier
2. Read [vam-s3-status.md](./vam-s3-status.md) - What's done vs planned

**Product Requirements**:
3. Read [vam-s3-staging-design.md](./vam-s3-staging-design.md) - Main PRD
4. Read [vam-s3-aws-architecture.md](./vam-s3-aws-architecture.md) - Architecture decisions

**Implementation**:
5. Follow [vam-s3-aws-architecture.md](./vam-s3-aws-architecture.md) - AWS setup (30 min)
6. Build tools per [vam-s3-staging-design.md](./vam-s3-staging-design.md) - Week 1-3

---

## Key Decisions

### Architecture (Approved)
✅ **Single S3 bucket**: `video-projects`
✅ **Purpose**: Active collaboration only (not long-term archive)
✅ **Structure**: `s3://video-projects/staging/v-{brand}/{project}/`
✅ **Lifecycle**: 90-day auto-delete

### Terminology (Clarified)
- **Staging** = Active collaboration (David ↔ Jan, S3)
- **Archive** = Completed projects (T7 SSD drive)
- **Glacier** = Deep archive (1+ years, future Phase 2)

### Cost Estimate
- **S3 Staging**: $2-5/month (active collaboration)
- **Future Glacier**: $0.20-0.40/month (long-term archive)

---

## Implementation Status

```
Phase 1 (SSD Backup):        ████████████████████ 100% ✅ Complete
Phase 2 (Glacier Archive):   ░░░░░░░░░░░░░░░░░░░░   0% 🔮 Future
Phase 3 (S3 Staging):        ░░░░░░░░░░░░░░░░░░░░   0% 📋 PRD Complete
```

**Next Step**: AWS setup (30 minutes) → Tool development (Week 1-3)

---

## Quick Reference

### Current Tools (Working)
```bash
# Generate manifest
ruby ../v-shared/video-asset-tools/bin/generate_manifest.rb

# Sync from SSD
ruby ../v-shared/video-asset-tools/bin/sync_from_ssd.rb

# Archive project
ruby ../v-shared/video-asset-tools/bin/archive_project.rb b65

# View dashboard
open ../v-shared/video-asset-tools/bin/dashboard.html
```

### Future Tools (Phase 3 - To Be Built)
```bash
# Upload to S3
ruby ../v-shared/video-asset-tools/bin/s3_sync_up.rb b65

# Download from S3
ruby ../v-shared/video-asset-tools/bin/s3_sync_down.rb b65

# Check S3 status
ruby ../v-shared/video-asset-tools/bin/s3_sync_status.rb b65

# Clean up S3
ruby ../v-shared/video-asset-tools/bin/s3_sync_cleanup.rb b65
```

---

## Related Documentation

### External (Outside video-asset-tools)
- `/dev/ad/storyline-app/tools/discover-projects.js` - Cross-repo registry generator
- `/dev/video-projects/video-projects-registry.json` - Cross-repo registry
- `/dev/video-projects/video-projects-dashboard.html` - Cross-repo dashboard

### Project-Specific
- Each `v-*` repo has own `CLAUDE.md` with local paths and commands

---

**Created**: 2025-11-03
**Last Updated**: 2025-11-03
**Maintainer**: David Cruwys
