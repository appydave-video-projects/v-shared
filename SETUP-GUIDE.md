# Setup Guide - Mac & Windows

This guide helps both Mac and Windows users get started with the video projects repositories.

## Prerequisites

### Mac Users
- ✅ Terminal (built-in)
- ✅ Git installed: `git --version`
- ✅ SSH keys configured for GitHub

### Windows Users
- ✅ **Git for Windows** (includes Git Bash) - [Download here](https://git-scm.com/download/win)
- ✅ SSH keys configured for GitHub
- ✅ Use **Git Bash** terminal (not CMD or PowerShell)

**Important for Windows**: After installing Git for Windows, always use **Git Bash** for running these scripts.

---

## Initial Setup

### Step 1: Clone v-shared (Mac)
```bash
cd ~/dev/video-projects  # Or your preferred location
git clone git@github.com:appydave-video-projects/v-shared.git
```

### Step 1: Clone v-shared (Windows - Git Bash)
```bash
cd ~/dev/video-projects  # Or your preferred location
git clone git@github.com:appydave-video-projects/v-shared.git
```

**Note**: Paths work the same in Git Bash on Windows! `~` means your home directory.

### Step 2: Clone All Other Repos

**Mac**:
```bash
cd ~/dev/video-projects/v-shared
./clone-all.sh
```

**Windows (Git Bash)**:
```bash
cd ~/dev/video-projects/v-shared
./clone-all.sh
```

This will clone all 6 other repos (v-appydave, v-voz, v-aitldr, v-kiros, v-beauty-and-joy, v-supportsignal).

---

## Daily Usage

### Sync All Repos (Pull Latest Changes)

**Mac**:
```bash
cd ~/dev/video-projects
v-shared/sync-all.sh
```

**Windows (Git Bash)**:
```bash
cd ~/dev/video-projects
v-shared/sync-all.sh
```

**Alternative** (works on both):
```bash
cd v-shared
./sync-all.sh
```

### Check Status of All Repos

**Mac**:
```bash
cd ~/dev/video-projects
v-shared/status-all.sh
```

**Windows (Git Bash)**:
```bash
cd ~/dev/video-projects
v-shared/status-all.sh
```

---

## Path Differences

### Home Directory
- **Mac**: `/Users/yourname/`
- **Windows**: `C:/Users/yourname/` (in Git Bash shown as `/c/Users/yourname/`)
- **Shortcut (both)**: `~` (works the same!)

### Example Paths

**Mac**:
```
~/dev/video-projects/v-shared
/Users/david/dev/video-projects/v-shared
```

**Windows**:
```
~/dev/video-projects/v-shared
/c/Users/jan/dev/video-projects/v-shared
```

---

## SSH Keys Setup (Both Platforms)

If you get "Permission denied (publickey)" errors:

### Check if SSH key exists:
```bash
ls -la ~/.ssh
```

Look for `id_rsa` and `id_rsa.pub` (or `id_ed25519` and `id_ed25519.pub`)

### Generate new SSH key if needed:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Add SSH key to GitHub:
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Paste the key

### Test connection:
```bash
ssh -T git@github.com
```

Should see: "Hi username! You've successfully authenticated"

---

## Working in Individual Repos

After syncing, you can work in individual repos normally:

```bash
cd ~/dev/video-projects/v-aitldr
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

**Same commands work on both Mac and Windows (in Git Bash)!**

---

## Troubleshooting

### Windows: "command not found" when running scripts

**Problem**: You're using CMD or PowerShell instead of Git Bash

**Solution**: Open **Git Bash** (search for "Git Bash" in Windows start menu)

### Mac: Permission denied when running scripts

**Problem**: Scripts aren't executable

**Solution**:
```bash
cd v-shared
chmod +x *.sh
```

### Both: "fatal: not a git repository"

**Problem**: You're not in the right directory

**Solution**: Make sure you're in the video-projects parent directory or v-shared

---

## Quick Reference

| Task | Command (Works on Both!) |
|------|-------------------------|
| Daily sync | `cd ~/dev/video-projects && v-shared/sync-all.sh` |
| Check status | `cd ~/dev/video-projects && v-shared/status-all.sh` |
| Clone all repos | `cd v-shared && ./clone-all.sh` |

**Remember**: Windows users must use **Git Bash**, not CMD or PowerShell!

---

Last updated: 2025-10-30
