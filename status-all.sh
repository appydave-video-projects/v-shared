#!/bin/bash
# Check status of all video project repositories
# Usage: cd v-shared && ./status-all.sh

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
echo -e "${BLUE}  Video Project Repositories Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

for repo in "${REPOS[@]}"; do
  repo_path="$PARENT_DIR/$repo"

  if [ ! -d "$repo_path" ]; then
    echo -e "${YELLOW}⊘ $repo - Not found${NC}"
    echo
    continue
  fi

  if [ ! -d "$repo_path/.git" ]; then
    echo -e "${YELLOW}⊘ $repo - Not a git repository${NC}"
    echo
    continue
  fi

  echo -e "${BLUE}📁 $repo${NC}"
  cd "$repo_path"

  # Check if repo is clean
  if git diff-index --quiet HEAD -- 2>/dev/null; then
    # No uncommitted changes

    # Check if ahead/behind remote
    LOCAL=$(git rev-parse @ 2>/dev/null)
    REMOTE=$(git rev-parse @{u} 2>/dev/null)

    if [ "$LOCAL" = "$REMOTE" ]; then
      echo -e "${GREEN}   ✓ Clean - up to date with remote${NC}"
    elif [ -z "$REMOTE" ]; then
      echo -e "${YELLOW}   ⚠ No remote tracking branch${NC}"
    else
      BASE=$(git merge-base @ @{u} 2>/dev/null)

      if [ "$LOCAL" = "$BASE" ]; then
        echo -e "${YELLOW}   ⚠ Behind remote - run sync-all.sh${NC}"
      elif [ "$REMOTE" = "$BASE" ]; then
        echo -e "${YELLOW}   ⚠ Ahead of remote - need to push${NC}"
      else
        echo -e "${RED}   ✗ Diverged from remote${NC}"
      fi
    fi
  else
    # Has uncommitted changes
    echo -e "${YELLOW}   ⚠ Has uncommitted changes:${NC}"
    git status --short | sed 's/^/      /'
  fi

  echo
done

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Status check complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
