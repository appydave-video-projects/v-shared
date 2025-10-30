#!/bin/bash
# Sync all video project repositories
# Usage: cd v-shared && ./sync-all.sh

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

REPOS=(
  "v-shared"
  "v-appydave"
  "v-voz"
  "v-aitldr"
  "v-kiros"
  "v-beauty-and-joy"
  "v-supportsignal"
)

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Syncing All Video Project Repositories${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

for repo in "${REPOS[@]}"; do
  repo_path="$PARENT_DIR/$repo"

  if [ ! -d "$repo_path" ]; then
    echo -e "${YELLOW}⊘ $repo - Not found, skipping${NC}"
    continue
  fi

  if [ ! -d "$repo_path/.git" ]; then
    echo -e "${YELLOW}⊘ $repo - Not a git repository, skipping${NC}"
    continue
  fi

  echo -e "${BLUE}📁 $repo${NC}"
  cd "$repo_path"

  # Check if there are uncommitted changes
  if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}   ⚠ Has uncommitted changes - pull may fail${NC}"
  fi

  # Pull latest changes
  if git pull origin main 2>&1 | grep -q "Already up to date"; then
    echo -e "${GREEN}   ✓ Already up to date${NC}"
  else
    echo -e "${GREEN}   ✓ Pulled latest changes${NC}"
  fi

  echo
done

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  All repositories synced!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
