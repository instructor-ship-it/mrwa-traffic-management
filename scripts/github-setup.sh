#!/bin/bash
# MRWA Traffic Management Library - GitHub Setup Script
# Run this script to create the GitHub repo and push all content

set -e

export PATH="$HOME/.local/bin:$PATH"

echo "============================================"
echo "  MRWA Library - GitHub Setup"
echo "============================================"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "ERROR: GitHub CLI not found. Install it first:"
    echo "  https://cli.github.com/"
    exit 1
fi

# Step 1: Authenticate
echo "Step 1: Authenticate with GitHub"
echo "  A browser window will open. Follow the prompts."
echo ""
gh auth login --hostname github.com --git-protocol https --web

# Step 2: Create the repo
echo ""
echo "Step 2: Creating GitHub repository..."
REPO_NAME="mrwa-traffic-management"
gh repo create "$REPO_NAME" --public --description "MRWA Traffic Management Reference Library — TGS diagram logic, GIS datasets, and EQSafe banner alert incident library" --source /home/z/my-project --push

echo ""
echo "============================================"
echo "  Done! Your repo is at:"
echo "  https://github.com/$(gh api user --jq .login)/$REPO_NAME"
echo "============================================"

# Step 3: Future push helper
echo ""
echo "For future pushes, run:"
echo "  cd /home/z/my-project"
echo "  git add -A && git commit -m 'Your message' && git push"
