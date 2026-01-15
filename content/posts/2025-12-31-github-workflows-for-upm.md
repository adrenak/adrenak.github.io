---
slug: github-workflows-for-upm
title: Some Github workflows for UPM repositories
date: 2025-12-31
tags: opensource
description: Making life a little easier.
published: yes
---

I recently made some changes to [BRW](https://github.com/adrenak/brw) and added some Github workflows to make life easier maintaining UPM repositories.

They're all currently standalone. I haven't figured out how I can "invoke" other workflows from a main workflow. So except for one, all others are manually triggered. Of course, you can merge them all into a single workflow file. Or introduce some ways to ensure they run in the order you want.

You can find the workflows [here](https://github.com/adrenak/brw/tree/master/.github/workflows). In case they change in the future, here they are.

<details>
<summary>npm-publish.yaml</summary>

I added this file because currently I publish _locally_ from my desktop. This requires me to checkout the `upm-latest` branch, do a `git clean -df` so I only have the package contents, and then invoke `npm publish`.

```yaml
# Github action that can be triggered to make an npm release
# You need a secret on Github called NPM_PUBLISH_TOKEN
# Configure RELEASE_BRANCH to match the name of the branch that has package.json as the root

name: Publish to NPM

on:
  workflow_dispatch:

env:
  RELEASE_BRANCH: upm-latest

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    
    steps:
      - name: Checkout upm-latest branch
        uses: actions/checkout@v4
        with:
          ref: ${{ env.RELEASE_BRANCH }}
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_PUBLISH_TOKEN }}

      - name: Configure npm authentication
        run: |
          npm whoami
      - name: Publish to npm
        run: npm publish
```
</details>

<details>
<summary>update-version.yaml</summary>

Sometimes I just forget to update package.json

This is very annoying.

So this file allows me to trigger a version update.

```yaml
# Github action that can be triggered to update the version in package.json
# Allows you to define values like major.minor.patch and if that should be set as the new version of incremented
# Set PACKAGE_JSON_PATH based on your repo 

name: Update Package Version

on:
  workflow_dispatch:
    inputs:
      major:
        description: 'Major version number'
        required: true
        type: number
        default: 0
      minor:
        description: 'Minor version number'
        required: true
        type: number
        default: 0
      patch:
        description: 'Patch version number'
        required: true
        type: number
        default: 0
      update_method:
        description: 'Update method'
        required: true
        type: choice
        options:
          - increment
          - set
        default: 'set'

env:
  PACKAGE_JSON_PATH: Assets/Adrenak.BRW/package.json

jobs:
  bump-version:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      - name: Read current version
        id: current-version
        run: |
          if [ ! -f "${{ env.PACKAGE_JSON_PATH }}" ]; then
            echo "Error: package.json not found at ${{ env.PACKAGE_JSON_PATH }}"
            exit 1
          fi
          
          CURRENT_VERSION=$(node -p "require('./${{ env.PACKAGE_JSON_PATH }}').version")
          echo "current_version=$CURRENT_VERSION" >> $GITHUB_OUTPUT
          echo "Current version: $CURRENT_VERSION"
          
          # Parse version components
          IFS='.' read -r CURRENT_MAJOR CURRENT_MINOR CURRENT_PATCH <<< "$CURRENT_VERSION"
          echo "current_major=$CURRENT_MAJOR" >> $GITHUB_OUTPUT
          echo "current_minor=$CURRENT_MINOR" >> $GITHUB_OUTPUT
          echo "current_patch=$CURRENT_PATCH" >> $GITHUB_OUTPUT
      - name: Calculate new version
        id: new-version
        run: |
          CURRENT_MAJOR=${{ steps.current-version.outputs.current_major }}
          CURRENT_MINOR=${{ steps.current-version.outputs.current_minor }}
          CURRENT_PATCH=${{ steps.current-version.outputs.current_patch }}
          
          INPUT_MAJOR=${{ inputs.major }}
          INPUT_MINOR=${{ inputs.minor }}
          INPUT_PATCH=${{ inputs.patch }}
          UPDATE_METHOD="${{ inputs.update_method }}"
          
          if [ "$UPDATE_METHOD" = "increment" ]; then
            # Increment mode: add values to current version
            NEW_MAJOR=$((CURRENT_MAJOR + INPUT_MAJOR))
            NEW_MINOR=$((CURRENT_MINOR + INPUT_MINOR))
            NEW_PATCH=$((CURRENT_PATCH + INPUT_PATCH))
            
            # Validate no negative values
            if [ $NEW_MAJOR -lt 0 ] || [ $NEW_MINOR -lt 0 ] || [ $NEW_PATCH -lt 0 ]; then
              echo "Error: Version cannot be negative. Result would be: $NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"
              exit 1
            fi
          else
            # Set mode: use input values directly
            NEW_MAJOR=$INPUT_MAJOR
            NEW_MINOR=$INPUT_MINOR
            NEW_PATCH=$INPUT_PATCH
            
            # Validate no negative values
            if [ $NEW_MAJOR -lt 0 ] || [ $NEW_MINOR -lt 0 ] || [ $NEW_PATCH -lt 0 ]; then
              echo "Error: Version cannot be negative. Input: $NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"
              exit 1
            fi
          fi
          
          NEW_VERSION="$NEW_MAJOR.$NEW_MINOR.$NEW_PATCH"
          echo "new_version=$NEW_VERSION" >> $GITHUB_OUTPUT
          echo "New version: $NEW_VERSION"
      - name: Update package.json
        run: |
          NEW_VERSION="${{ steps.new-version.outputs.new_version }}"
          node -e "
            const fs = require('fs');
            const path = '${{ env.PACKAGE_JSON_PATH }}';
            const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
            pkg.version = '$NEW_VERSION';
            fs.writeFileSync(path, JSON.stringify(pkg, null, '\t') + '\n');
          "
          echo "Updated ${{ env.PACKAGE_JSON_PATH }} to version $NEW_VERSION"
      - name: Commit and push changes
        run: |
          git add "${{ env.PACKAGE_JSON_PATH }}"
          
          if git diff --staged --quiet; then
            echo "No changes to commit."
          else
            CURRENT_VERSION="${{ steps.current-version.outputs.current_version }}"
            NEW_VERSION="${{ steps.new-version.outputs.new_version }}"
            git commit -m "chore: bump version from $CURRENT_VERSION to $NEW_VERSION"
            git push origin master
            echo "Committed and pushed version bump: $CURRENT_VERSION -> $NEW_VERSION"
          fi
```

</details>

<details>
<summary>sync-readme-and-update-upm-branch.yaml</summary>

I configure this to also run on `push` because this ensures my README files and upm-branch contents are always up to date.

```yaml
# Used for Unity UPM repositories where the main/master branch has the Unity project root and the actual UPM package directory is somewhere inside Assets/
# This file updates Assets/../README.md based on the latest root README.md
# Then updates a dedicated UPM branch
# Configure env variables based on your needs

name: Sync README and Update UPM Branch

on:
  push:
    branches:
      - master
  workflow_dispatch:

env:
  SUBDIRECTORY_PATH: Assets/Adrenak.BRW
  UPM_BRANCH: upm-latest

jobs:
  sync-readme:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      - name: Check if README needs update
        id: check-readme
        run: |
          ROOT_README="README.md"
          SUB_README="${{ env.SUBDIRECTORY_PATH }}/README.md"
          
          if [ ! -f "$ROOT_README" ]; then
            echo "Root README.md not found. Exiting."
            exit 1
          fi
          
          if [ ! -f "$SUB_README" ]; then
            echo "needs_update=true" >> $GITHUB_OUTPUT
            echo "Subdirectory README.md does not exist. Will create it."
          elif ! cmp -s "$ROOT_README" "$SUB_README"; then
            echo "needs_update=true" >> $GITHUB_OUTPUT
            echo "README.md files differ. Will update subdirectory README."
          else
            echo "needs_update=false" >> $GITHUB_OUTPUT
            echo "README.md files are identical. No update needed."
          fi
      - name: Copy README to subdirectory
        if: steps.check-readme.outputs.needs_update == 'true'
        run: |
          mkdir -p "${{ env.SUBDIRECTORY_PATH }}"
          cp README.md "${{ env.SUBDIRECTORY_PATH }}/README.md"
          echo "Copied README.md to ${{ env.SUBDIRECTORY_PATH }}/"
      - name: Commit and push changes
        if: steps.check-readme.outputs.needs_update == 'true'
        run: |
          git add "${{ env.SUBDIRECTORY_PATH }}/README.md"
          
          if git diff --staged --quiet; then
            echo "No changes to commit."
          else
            git commit -m "chore: sync README.md to ${{ env.SUBDIRECTORY_PATH }}/"
            git push origin master
            echo "Committed and pushed README.md update."
          fi
  update-upm-branch:
    needs: sync-readme
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - name: Checkout master branch
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0
          ref: master

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      - name: Check if subdirectory exists
        id: check-subdir
        run: |
          if [ ! -d "${{ env.SUBDIRECTORY_PATH }}" ]; then
            echo "Subdirectory ${{ env.SUBDIRECTORY_PATH }} not found. Exiting."
            exit 1
          fi
          echo "Subdirectory found: ${{ env.SUBDIRECTORY_PATH }}"
      - name: Copy subdirectory to temporary location
        run: |
          # Copy subdirectory contents to a temp location before switching branches
          mkdir -p /tmp/package-contents
          cp -r "${{ env.SUBDIRECTORY_PATH }}"/* /tmp/package-contents/ 2>/dev/null || true
          cp -r "${{ env.SUBDIRECTORY_PATH }}"/.[!.]* /tmp/package-contents/ 2>/dev/null || true
          echo "Copied contents to temporary location"
      - name: Create or checkout upm-latest branch
        run: |
          # Check if branch exists
          if git ls-remote --heads origin ${{ env.UPM_BRANCH }} | grep -q "${{ env.UPM_BRANCH }}"; then
            echo "Branch ${{ env.UPM_BRANCH }} exists. Checking out..."
            git fetch origin ${{ env.UPM_BRANCH }}:${{ env.UPM_BRANCH }}
            git checkout ${{ env.UPM_BRANCH }}
          else
            echo "Branch ${{ env.UPM_BRANCH }} does not exist. Creating..."
            git checkout --orphan ${{ env.UPM_BRANCH }}
            git rm -rf --cached . || true
          fi
      - name: Clear branch contents
        run: |
          # Remove all files except .git
          find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
      - name: Copy subdirectory contents to branch root
        run: |
          # Copy from temporary location to branch root
          cp -r /tmp/package-contents/* .
          echo "Copied contents from temporary location to branch root"
      - name: Commit and push changes
        run: |
          git add -A
          
          if git diff --staged --quiet && git diff --quiet; then
            echo "No changes to commit."
          else
            git commit -m "chore: update upm-latest branch with latest package contents"
            git push origin ${{ env.UPM_BRANCH }}
            echo "Committed and pushed to ${{ env.UPM_BRANCH }} branch."
          fi
```
</details>