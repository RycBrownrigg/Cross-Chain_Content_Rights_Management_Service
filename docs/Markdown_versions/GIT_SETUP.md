# Git Repository Structure and Management

## Overview

This project uses two git repositories managed via a **git submodule** relationship:

| Repository | Purpose | GitHub Remote |
|-----------|---------|---------------|
| **Root** (`Cross-Chain_Content_Rights_Management_Service`) | Thesis documentation, phase deliverables, project-level config | `https://github.com/RycBrownrigg/Cross-Chain_Content_Rights_Management_Service.git` |
| **Submodule** (`content-rights-parachain`) | Parachain source code (runtime, pallets, node, contracts) | `https://github.com/RycBrownrigg/content-rights-parachain.git` |

The root repo tracks the parachain repo as a git submodule, meaning it stores a **pointer to a specific commit** in the parachain repo rather than a copy of the files.

---

## How the Submodule Was Set Up

The `content-rights-parachain` directory was originally cloned independently inside the root project directory. It had its own `.git/` directory, commit history, and GitHub remote. The root repo saw it as an untracked directory.

To formalise the relationship, the following command was run from the root repo:

```bash
git submodule add https://github.com/RycBrownrigg/content-rights-parachain.git content-rights-parachain
```

This created two things in the root repo:

1. **`.gitmodules`** — a configuration file recording the submodule's path and remote URL:
   ```ini
   [submodule "content-rights-parachain"]
       path = content-rights-parachain
       url = https://github.com/RycBrownrigg/content-rights-parachain.git
   ```

2. **A submodule reference** — the root repo's index now tracks which commit hash in the parachain repo corresponds to the current thesis state.

Both were committed to the root repo with:

```bash
git add .gitmodules content-rights-parachain
git commit -m "Add content-rights-parachain as git submodule"
```

---

## Day-to-Day Workflow

### Working in the parachain repo only (most common)

When making code changes to the parachain:

```bash
cd content-rights-parachain
# ... make changes ...
git add <files>
git commit -m "Description of changes"
git push origin main
```

The root repo will now show `content-rights-parachain (modified content)` or `(new commits)` in `git status`. This is expected — it means the submodule has moved ahead of the pointer the root repo is tracking.

### Working in the root repo only

When updating thesis documentation:

```bash
# From root directory
git add <files>
git commit -m "Description of changes"
git push origin main
```

This does not affect the parachain repo at all.

### Updating the submodule pointer in the root repo

After committing in the parachain repo, update the root repo's reference so it points to the latest parachain commit:

```bash
# From root directory
git add content-rights-parachain
git commit -m "Update content-rights-parachain submodule reference"
git push origin main
```

This records in the root repo's history exactly which parachain commit corresponds to the current state of the thesis documentation.

### Full workflow (both repos changed)

```bash
# 1. Commit parachain changes first
cd content-rights-parachain
git add <files>
git commit -m "Implement content-rights pallet"
git push origin main

# 2. Return to root, commit thesis changes and update submodule pointer
cd ..
git add "Phase 4 - Core Development & Implementation (Weeks 13-16)/..."
git add content-rights-parachain
git commit -m "Add Phase 4 deliverables and update parachain submodule"
git push origin main
```

---

## Cloning the Project (For Examiners or Collaborators)

Anyone cloning the root repo needs to initialise the submodule to get the parachain code:

```bash
# Clone with submodule in one step
git clone --recurse-submodules https://github.com/RycBrownrigg/Cross-Chain_Content_Rights_Management_Service.git

# Or clone first, then initialise
git clone https://github.com/RycBrownrigg/Cross-Chain_Content_Rights_Management_Service.git
cd Cross-Chain_Content_Rights_Management_Service
git submodule update --init
```

Without `--recurse-submodules` or `git submodule update --init`, the `content-rights-parachain/` directory will exist but be empty.

---

## Remote Repository Management

### Two independent GitHub repositories

Each repo has its own GitHub remote and can be managed independently:

- **Root repo:** `https://github.com/RycBrownrigg/Cross-Chain_Content_Rights_Management_Service.git`
- **Parachain repo:** `https://github.com/RycBrownrigg/content-rights-parachain.git`

### Pushing changes

Each repo is pushed separately:

```bash
# Push parachain changes
cd content-rights-parachain
git push origin main

# Push root changes (including submodule pointer updates)
cd ..
git push origin main
```

### Branch management

Both repos use `main` as the primary branch. If feature branches are needed, create them in the relevant repo:

```bash
# Feature branch in parachain repo
cd content-rights-parachain
git checkout -b feature/content-rights-pallet
# ... work, commit ...
git push origin feature/content-rights-pallet
# Merge via PR on GitHub, then update root submodule pointer
```

---

## Future Merge Into a Single Repository

At some point (likely after thesis submission), it may be desirable to merge both repos into a single repository. There are two approaches:

### Option A: Absorb the submodule (recommended)

This removes the submodule relationship and brings the parachain code directly into the root repo, preserving all commit history from both repos.

```bash
# From root directory

# 1. Remove the submodule registration
git submodule deinit content-rights-parachain
git rm content-rights-parachain
rm -rf .git/modules/content-rights-parachain

# 2. Merge the parachain repo's history using subtree
git subtree add --prefix=content-rights-parachain \
    https://github.com/RycBrownrigg/content-rights-parachain.git main

# 3. Commit and push
git push origin main
```

After this:
- All parachain files live in `content-rights-parachain/` as regular tracked files
- The parachain repo's full commit history is preserved in the root repo
- Only one remote repo needs to be maintained going forward
- The separate parachain GitHub repo can be archived

### Option B: Move everything into the parachain repo

If the code repo is considered the primary artifact:

```bash
# From parachain repo
# Copy thesis docs into a docs/ or thesis/ subdirectory
# Commit and push
# Archive the root repo
```

This is simpler but loses the root repo's commit history unless a subtree merge is used in reverse.

### Recommendation

**Option A** is preferred because:
- The root repo already has the thesis documentation history
- The submodule relationship means the root repo is the natural "parent"
- `git subtree add` preserves the full parachain commit history
- The result is a single repo with complete history from both sources

**Timing:** Do this after thesis submission to avoid disrupting the workflow during active development. The submodule setup works well for the development phase where code and documentation change at different rates.

---

## Quick Reference

| Task | Command(s) |
|------|-----------|
| Check root repo status | `git status` (from root) |
| Check parachain status | `cd content-rights-parachain && git status` |
| Commit parachain changes | `cd content-rights-parachain && git add <files> && git commit -m "msg" && git push` |
| Update submodule pointer | `git add content-rights-parachain && git commit -m "Update submodule ref"` (from root) |
| Clone with submodule | `git clone --recurse-submodules <root-repo-url>` |
| Initialise submodule after clone | `git submodule update --init` |
| See which parachain commit root tracks | `git submodule status` |
| Pull latest parachain changes | `cd content-rights-parachain && git pull origin main` |
