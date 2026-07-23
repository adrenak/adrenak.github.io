---
slug: git-hook-for-large-files
title: Git hook to catch large files
date: 2027-07-24
tags: git
description: You commited a 200mb file 10 commits ago. Now you can't push to remote.
thumbnail: content/images/_/large-file-git-hook.jpg
published: yes
---

Unity projects often contain large videos, audio files, textures, archives, and generated data.

The problem usually appears when you finally push:

```text
remote: error: File Assets/Videos/Trailer.mp4 is 143.27 MB
remote: error: this exceeds GitHub's file size limit
```

If that file was committed several commits ago, deleting it in the latest commit will not help. It is still present in Git history.

The easiest fix is to block oversized files before the commit is created.

This pre-commit hook will:

- Warn for files larger than 50 MiB
- Block files larger than 100 MiB
- Check the actual staged file size
- Ignore file extensions completely

## 1. Create the hook

From the root of your repository, create:

```text
.githooks/pre-commit
```

The filename must be exactly `pre-commit`, with no extension.

Paste this into it:

```bash
#!/usr/bin/env bash

WARN_LIMIT_MIB=50
BLOCK_LIMIT_MIB=100

WARN_LIMIT_BYTES=$((WARN_LIMIT_MIB * 1024 * 1024))
BLOCK_LIMIT_BYTES=$((BLOCK_LIMIT_MIB * 1024 * 1024))

blocked=0
warned=0

format_size() {
    awk -v bytes="$1" 'BEGIN {
        printf "%.2f MiB", bytes / 1024 / 1024
    }'
}

while IFS= read -r -d '' file; do
    object_type=$(git cat-file -t ":$file" 2>/dev/null) || continue
    [ "$object_type" = "blob" ] || continue

    size=$(git cat-file -s ":$file" 2>/dev/null) || continue
    formatted_size=$(format_size "$size")

    if (( size > BLOCK_LIMIT_BYTES )); then
        printf '\nERROR: File exceeds %d MiB:\n' \
            "$BLOCK_LIMIT_MIB" >&2
        printf '  %s (%s)\n' "$file" "$formatted_size" >&2
        blocked=1

    elif (( size > WARN_LIMIT_BYTES )); then
        printf '\nWARNING: Large file being committed:\n' >&2
        printf '  %s (%s)\n' "$file" "$formatted_size" >&2
        warned=1
    fi
done < <(
    git diff \
        --cached \
        --name-only \
        --diff-filter=ACMRT \
        -z
)

if (( blocked )); then
    printf '\nCommit cancelled.\n' >&2
    printf 'Remove the file from staging with:\n\n' >&2
    printf '  git restore --staged -- "path/to/file"\n\n' >&2
    exit 1
fi

if (( warned )); then
    printf '\nCommit allowed, but one or more files are unusually large.\n' >&2
fi

exit 0
```

## 2. Enable the hook

Run this from the repository root:

```bash
git config core.hooksPath .githooks
```

Check that it worked:

```bash
git config --get core.hooksPath
```

Expected output:

```text
.githooks
```

## 3. Make it work across Windows, macOS, and Linux

Add this to `.gitattributes`:

```gitattributes
.githooks/* text eol=lf
```

This forces LF line endings and avoids errors such as:

```text
/usr/bin/env: 'bash\r': No such file or directory
```

On macOS and Linux, run:

```bash
chmod +x .githooks/pre-commit
```

On Windows:

- Install Git for Windows
- Make sure the file is named `pre-commit`, not `pre-commit.txt`
- Make sure the file uses LF line endings
- If needed, run this from Git Bash:

```bash
chmod +x .githooks/pre-commit
```

## 4. Test it

### Windows PowerShell

Create a 60 MiB file:

```powershell
$file = [System.IO.File]::Create("test-60mb.bin")
$file.SetLength(60MB)
$file.Close()
```

Create a 110 MiB file:

```powershell
$file = [System.IO.File]::Create("test-110mb.bin")
$file.SetLength(110MB)
$file.Close()
```

### macOS or Linux

Create a 60 MiB file:

```bash
dd if=/dev/zero of=test-60mb.bin bs=1M count=60
```

Create a 110 MiB file:

```bash
dd if=/dev/zero of=test-110mb.bin bs=1M count=110
```

Now try committing them:

```bash
git add test-60mb.bin
git commit -m "Test warning"
```

The commit should succeed with a warning.

Then try:

```bash
git add test-110mb.bin
git commit -m "Test blocking"
```

The commit should be cancelled.

Remove the blocked file from staging with:

```bash
git restore --staged -- test-110mb.bin
```

## Done

From now on:

- Files larger than 50 MiB produce a warning
- Files larger than 100 MiB block the commit
- The check uses the staged file, not the working copy
- File extensions do not matter

That means oversized Unity assets are caught immediately instead of several commits later when you finally push.
