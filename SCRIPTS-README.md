# Video Projects Helper Scripts

This directory contains helper scripts for managing all video project repositories.

**Location**: These scripts live in `v-shared` and operate on all sibling repos.

## Available Scripts

### `./sync-all.sh` - Daily Sync (Pull All Repos)

**Usage**: Run this at the start of each day to pull latest changes from all repos.

```bash
cd v-shared
./sync-all.sh
```

**What it does**:
- Pulls latest changes from `main` branch for all repos
- Shows which repos are already up to date
- Warns if a repo has uncommitted changes

**Repos synced**:
- v-shared
- v-appydave
- v-voz
- v-aitldr
- v-kiros
- v-beauty-and-joy
- v-supportsignal

---

### `./status-all.sh` - Check Status

**Usage**: Check the git status of all repos at once.

```bash
cd v-shared
./status-all.sh
```

**What it shows**:
- ✓ Clean repos (no changes, up to date with remote)
- ⚠ Repos with uncommitted changes
- ⚠ Repos ahead of remote (need to push)
- ⚠ Repos behind remote (need to pull)

---

### `./clone-all.sh` - Initial Setup (Jan)

**Usage**: For initial setup - clone all repos at once.

```bash
cd v-shared
./clone-all.sh
```

**Who needs this**: Jan (or anyone setting up for the first time)

**What it does**:
- Clones all video project repos from GitHub
- Skips repos that already exist locally
- Uses SSH authentication (requires GitHub SSH keys configured)

**After cloning**:
1. Run `./status-all.sh` to verify all repos cloned successfully
2. Use `./sync-all.sh` daily to stay up to date

---

## Workflow

### Daily Routine (David & Jan)

**Start of day**:
```bash
cd v-shared
./sync-all.sh
```

**During work**:
- Make changes in individual repos
- Commit and push from each repo as usual

**Before ending day** (optional):
```bash
cd v-shared
./status-all.sh  # Check what you changed today
```

### Pushing Changes

**These scripts only PULL changes**. You're still responsible for:
- Committing your changes: `git add . && git commit -m "message"`
- Pushing to remote: `git push origin main`

Scripts don't auto-push to avoid accidentally pushing unfinished work.

---

## Directory Structure

```
video-projects/              # Parent directory (NOT a git repo)
├── v-shared/                # Shared documentation (git repo) ⭐
│   ├── sync-all.sh          # Daily sync script
│   ├── status-all.sh        # Check all repo status
│   ├── clone-all.sh         # Initial setup script
│   ├── SCRIPTS-README.md    # This file
│   ├── CLAUDE.md            # Shared documentation
│   └── README.md            # Overview
├── v-appydave/              # AppyDave brand (git repo)
├── v-voz/                   # VOZ client (git repo)
├── v-aitldr/                # AITLDR brand (git repo)
├── v-kiros/                 # Kiros client (git repo)
├── v-beauty-and-joy/        # Beauty & Joy brand (git repo)
└── v-supportsignal/         # SupportSignal client (git repo)
```

**Note**: The parent directory is NOT a git repo - it's just a container for the individual repos.

---

## Troubleshooting

### Script won't run

Make sure scripts are executable:
```bash
chmod +x sync-all.sh status-all.sh clone-all.sh
```

### Pull fails with "uncommitted changes"

Commit or stash your changes first:
```bash
cd v-appydave
git add .
git commit -m "WIP: describe changes"
# Now sync-all.sh will work
```

### Clone fails for Jan

Check SSH keys are configured:
```bash
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated"
```

If not configured, see: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

Last updated: 2025-10-30
