# Security Setup for video-projects

**Created**: 2025-10-20
**Updated**: 2025-10-20
**Purpose**: Automated secret scanning with zero human intervention

---

## ✅ Automated Protection (No Maintenance Required)

### Layer 1: **GitHub Secret Scanning** (Primary Protection)

**One-time setup** (5 minutes):

1. **Organization-level** (applies to ALL repos automatically):
   - Go to: https://github.com/organizations/appydave-video-projects/settings/security_analysis
   - Enable:
     - ✅ **Secret scanning** for new repositories
     - ✅ **Push protection** for new repositories
     - ✅ **Dependency graph**
     - ✅ **Dependabot alerts**

2. **Per-repo** (enable for existing repos):
   - [v-appydave](https://github.com/appydave-video-projects/v-appydave/settings/security_analysis)
   - [v-voz](https://github.com/appydave-video-projects/v-voz/settings/security_analysis)
   - [v-aitldr](https://github.com/appydave-video-projects/v-aitldr/settings/security_analysis)

   Enable for each:
   - ✅ **Secret scanning**
   - ✅ **Push protection**

**Result**: GitHub automatically blocks ALL pushes containing secrets. Forever. Zero maintenance.

---

### Layer 2: **GitHub Actions** (Backup Scanner)

**Already configured** in each repo at `.github/workflows/gitleaks.yml`

- Runs automatically on every push to main
- Scans entire repository history
- Fails the build if secrets detected
- **No updates needed** - workflow uses latest gitleaks version automatically

**File location** (already created):
- `v-appydave/.github/workflows/gitleaks.yml`
- `v-voz/.github/workflows/gitleaks.yml`
- `v-aitldr/.github/workflows/gitleaks.yml`

---

### Layer 3: **Pre-commit Hooks** (Local Protection - Optional)

**One-time setup per repo**:

```bash
# Install pre-commit (once on your machine)
brew install pre-commit

# Enable for each repo (one-time per repo)
cd ~/dev/video-projects/v-appydave && pre-commit install
cd ~/dev/video-projects/v-voz && pre-commit install
cd ~/dev/video-projects/v-aitldr && pre-commit install
```

**Config files** (already created):
- `v-appydave/.pre-commit-config.yaml`
- `v-voz/.pre-commit-config.yaml`
- `v-aitldr/.pre-commit-config.yaml`

**Result**: Blocks commits locally BEFORE they reach GitHub.

---

## 🔍 What Gets Detected

The scanning detects:
- ✅ AWS Access Keys & Secret Keys
- ✅ GitHub Personal Access Tokens (ghp_*, gh_*)
- ✅ OpenAI API Keys (sk-...)
- ✅ Anthropic API Keys (sk-ant-...)
- ✅ Generic API keys/tokens
- ✅ Private SSH/RSA keys
- ✅ Database connection strings with passwords
- ✅ OAuth tokens
- ✅ Slack tokens
- ✅ Stripe keys
- ✅ 100+ secret patterns

---

## 🛡️ Protection Layers Summary

| Layer | When | Auto? | Maintenance |
|-------|------|-------|-------------|
| **GitHub Push Protection** | Before push | ✅ Yes | ✅ None - GitHub manages |
| **GitHub Secret Scanning** | After push | ✅ Yes | ✅ None - GitHub manages |
| **GitHub Actions** | On every push | ✅ Yes | ✅ None - auto-updates |
| **Pre-commit hooks** | Before commit | ⚠️ Manual setup | ✅ None after setup |

---

## 🚫 What to NEVER Commit

**Files that should NEVER be committed:**
- `.env`, `.env.local`, `.env.production`
- `credentials.json`, `secrets.json`, `config.secret.yml`
- `id_rsa`, `*.pem`, `*.key` (private keys)
- Database dumps with real data
- API keys in code comments

**Already gitignored:**
- Video files (`.mp4`, `.mov`, `.avi`)
- Build artifacts (`node_modules`, `.next`)
- OS files (`.DS_Store`)

---

## 🔧 Configuration Files

Each repo has these files (no manual updates needed):

**`.github/workflows/gitleaks.yml`** - GitHub Actions workflow
- Auto-runs on every push
- Uses latest gitleaks version
- No updates required

**`.pre-commit-config.yaml`** - Pre-commit hook config
- Pins gitleaks version (v8.18.0)
- Update annually or when new features needed

**`.gitleaks.toml`** - Detection rules
- Standard rules for common secrets
- Only update if you need custom patterns

---

## 🚨 What Happens If Secret Is Committed

### If Push Protection Catches It (Before Push):
```
remote: Secret scanning found 1 secret(s)
remote: Push blocked: AWS Access Key detected
```
**Action**: Remove secret from code, commit again

### If It Gets Through (Unlikely):
1. GitHub sends alert to repo admins
2. GitHub Actions build fails
3. **Immediately revoke/rotate the secret** (AWS, GitHub, OpenAI console)
4. Remove from history:
   ```bash
   # Install BFG Repo Cleaner
   brew install bfg

   # Remove secret file from entire history
   bfg --delete-files secrets.json
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

---

## 📋 Maintenance Schedule

**Required**: ✅ **NONE** - Everything is automated

**Optional** (annually):
- Update `.pre-commit-config.yaml` to latest gitleaks version
- Review `.gitleaks.toml` for new secret patterns

---

## 🎯 Quick Start Checklist

- [ ] Enable GitHub secret scanning (organization-level) - **5 minutes, do once**
- [ ] Enable GitHub secret scanning (per-repo) - **1 minute per repo**
- [ ] *(Optional)* Install pre-commit hooks - **2 minutes per repo**

**After that**: Zero maintenance, full protection forever.

---

## 📚 Resources

- [GitHub Secret Scanning Docs](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Pre-commit Framework](https://pre-commit.com)

---

**Last Updated**: 2025-10-20
**Repos Protected**: v-appydave, v-voz, v-aitldr
