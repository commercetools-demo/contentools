#!/bin/bash

# Publish script for Puck packages
# Requires: clean git state, npm login
# Usage: ./publish-puck-packages.sh [--yes]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PACKAGES=(
    "packages/puck-types"
    "packages/puck-api"
    "packages/puck-theme-manager"
    "packages/puck-content-manager"
    "packages/puck-image-picker"
    "packages/puck-editor"
    "packages/puck-page-manager"
    "packages/puck-renderer"
    "packages/puck-version-history"
)

AUTO_YES=false
for arg in "$@"; do
    [[ "$arg" == "--yes" || "$arg" == "-y" ]] && AUTO_YES=true
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}   Puck Package Publication Script${NC}"
echo -e "${BLUE}===========================================${NC}"

# --- npm auth ---
echo -e "${BLUE}🔐 Checking npm authentication...${NC}"
if ! npm whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Not logged in to npm. Run 'npm login' first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Logged in as: $(npm whoami)${NC}"

# --- git status ---
echo -e "${BLUE}📋 Checking git status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Git working directory is not clean. Commit or stash changes first.${NC}"
    git status --porcelain
    # exit 1
fi
echo -e "${GREEN}✅ Git working directory is clean${NC}"

# --- confirm ---
echo ""
echo -e "${YELLOW}Packages to publish:${NC}"
for pkg in "${PACKAGES[@]}"; do
    pkg_json="$pkg/package.json"
    if [ -f "$pkg_json" ]; then
        name=$(node -p "require('./$pkg_json').name")
        version=$(node -p "require('./$pkg_json').version")
        echo -e "  • ${name}@${version}"
    fi
done
echo ""

if [ "$AUTO_YES" = false ]; then
    read -p "Build and publish all packages? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cancelled.${NC}"
        exit 0
    fi
fi

# --- build ---
echo -e "${BLUE}🔨 Building packages...${NC}"
yarn build
echo -e "${GREEN}✅ Build complete${NC}"

# --- publish ---
echo -e "${BLUE}📦 Publishing packages...${NC}"
failed_packages=()

for pkg in "${PACKAGES[@]}"; do
    pkg_json="$pkg/package.json"
    if [ ! -f "$pkg_json" ]; then
        echo -e "${RED}  ❌ $pkg_json not found — skipping${NC}"
        failed_packages+=("$pkg")
        continue
    fi

    name=$(node -p "require('./$pkg_json').name")
    version=$(node -p "require('./$pkg_json').version")

    echo -e "${BLUE}  📦 Publishing ${name}@${version}...${NC}"

    if [ ! -d "$pkg/dist" ]; then
        echo -e "${RED}  ❌ No dist/ in $pkg — build may have failed${NC}"
        failed_packages+=("$name")
        continue
    fi

    (
        cd "$pkg"
        TARBALL="$(mktemp -t package.XXXXXX).tgz"
        if yarn pack --filename "$TARBALL" 2>/dev/null; then
            if npm publish "$TARBALL" 2>&1; then
                echo -e "${GREEN}  ✅ Published ${name}@${version}${NC}"
            else
                echo -e "${RED}  ❌ npm publish failed for ${name}${NC}"
                rm -f "$TARBALL" || true
                exit 1
            fi
            rm -f "$TARBALL" || true
        else
            echo -e "${RED}  ❌ yarn pack failed for ${name}${NC}"
            exit 1
        fi
    ) || failed_packages+=("$name")
done

# --- summary ---
echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}   Summary${NC}"
echo -e "${BLUE}===========================================${NC}"

if [ ${#failed_packages[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All packages published successfully!${NC}"
else
    echo -e "${RED}❌ Failed packages:${NC}"
    for p in "${failed_packages[@]}"; do
        echo -e "${RED}  ❌ $p${NC}"
    done
    exit 1
fi
