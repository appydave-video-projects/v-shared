# Task: Edit Rony Video - Add Final Assets

**Created**: 2025-10-30
**For**: Jan
**Priority**: High
**Related Repos**: v-kiros
**Estimated Time**: 2-3 hours

## Description

Edit the Rony project video and export final versions to the `final/` directory.

## Context

We have two voice variants recorded:
- American voice (Grace)
- British voice (Alice)

Need final exports of both for client review.

## Acceptance Criteria

- [ ] Create `v-kiros/rony/final/` directory
- [ ] Export: `rony-american-grace-v1.mp4`
- [ ] Export: `rony-british-alice-v1.mp4`
- [ ] Verify both files are under 500MB
- [ ] Commit and push to v-kiros repo

## File Naming

Follow the convention from CLAUDE.md:
- Format: `{project-name}-{variant}-v{version}.mp4`
- Lowercase with hyphens
- Include voice variant in filename

## Notes

- Source files are in `v-kiros/rony/voice1-american-grace/` and `v-kiros/rony/voice2-british-alice/`
- Final exports should be 1080p, H.264, reasonable bitrate
- Files in `final/` will be tracked in git (exception to video ignore rules)

## Questions?

Ask in Slack or add a comment to this file and push it.

---

## Jan's Progress

_[Add your progress notes here when you start working on this]_

## Completed

_[Mark as complete when done]_
