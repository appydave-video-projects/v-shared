#!/bin/bash
# Clone all video project repositories
# Usage: cd v-shared && ./clone-all.sh
#
# This script is for initial setup - Jan should run this once to clone all repos
# After that, use sync-all.sh for daily syncing

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# GitHub organization
ORG="appydave-video-projects"

# Repository list
declare -A REPOS=(
  ["v-shared"]="git@github.com:${ORG}/v-shared.git"
  ["v-appydave"]="git@github.com:${ORG}/v-appydave.git"
  ["v-voz"]="git@github.com:${ORG}/v-voz.git"
  ["v-aitldr"]="git@github.com:${ORG}/v-aitldr.git"
  ["v-kiros"]="git@github.com:${ORG}/v-kiros.git"
  ["v-beauty-and-joy"]="git@github.com:${ORG}/v-beauty-and-joy.git"
  ["v-supportsignal"]="git@github.com:${ORG}/v-supportsignal.git"
)

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Cloning All Video Project Repositories${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

cd "$PARENT_DIR"

for repo in "${!REPOS[@]}"; do
  repo_url="${REPOS[$repo]}"
  repo_path="$PARENT_DIR/$repo"

  if [ -d "$repo_path" ]; then
    echo -e "${YELLOW}⊘ $repo - Already exists, skipping${NC}"
    continue
  fi

  echo -e "${BLUE}📁 Cloning $repo...${NC}"

  if git clone "$repo_url" "$repo"; then
    echo -e "${GREEN}   ✓ Successfully cloned${NC}"
  else
    echo -e "${RED}   ✗ Failed to clone - check SSH keys and GitHub access${NC}"
  fi

  echo
done

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  All repositories cloned!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Run ${GREEN}./status-all.sh${NC} to check repository status"
echo -e "  2. Use ${GREEN}./sync-all.sh${NC} daily to pull latest changes"
