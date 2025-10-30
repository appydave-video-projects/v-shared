# T7 Drive Sync Strategy

**Created**: 2025-10-20
**Status**: Planning document for future implementation

## Goal

Separate video assets (38GB on T7 drive) from metadata (137MB in git), while maintaining ability to:
1. Run AI analysis on transcripts without having videos locally
2. Reduce cognitive load with grouped T7 folders (b00-b49, b50-b99)
3. Selectively restore videos when needed
4. Free up local disk space

## T7 Drive Structure

```
/Volumes/T7/youtube-PUBLISHED/appydave/
├── b00-b49/          # Range 1
├── b50-b99/          # Range 2
└── b100-b149/        # Future ranges
```

## Scripts Needed (Future)

1. **sync-metadata-from-t7.sh** - Extract metadata from T7 to local
2. **restore-videos.sh** - Bring back specific video files when needed
3. **generate-inventory.sh** - Track what's on T7 vs local vs GitHub

## See Full Plan

See detailed implementation in Claude conversation from 2025-10-20.
