# Basic Git Commands Guide

This guide explains essential Git commands and provides practical examples for each.

## Table of Contents
- [git init](#git-init)
- [git clone](#git-clone)
- [git status](#git-status)
- [git add](#git-add)
- [git commit](#git-commit)
- [git push](#git-push)
- [git pull](#git-pull)

---

## git init

**Purpose:** Initializes a new Git repository in the current directory.

**Usage:**
```bash
git init
```

**Example:**
```bash
# Create a new project directory
mkdir my-project
cd my-project

# Initialize a Git repository
git init

# Output: Initialized empty Git repository in /path/to/my-project/.git/
```

**What it does:**
- Creates a `.git` subdirectory in your project
- Sets up the necessary repository structure
- Enables version control for your project

---

## git clone

**Purpose:** Creates a copy of an existing remote repository on your local machine.

**Usage:**
```bash
git clone <repository-url>
git clone <repository-url> <directory-name>
```

**Examples:**
```bash
# Clone a repository using HTTPS
git clone https://github.com/username/repository.git

# Clone a repository using SSH
git clone git@github.com:username/repository.git

# Clone into a specific directory
git clone https://github.com/username/repository.git my-custom-folder

# Clone a specific branch
git clone -b develop https://github.com/username/repository.git
```

**What it does:**
- Downloads the entire repository history
- Creates a local copy of all files
- Sets up a remote connection named 'origin'
- Checks out the default branch

---

## git status

**Purpose:** Shows the current state of your working directory and staging area.

**Usage:**
```bash
git status
```

**Example:**
```bash
# Check the status of your repository
git status

# Example output:
# On branch main
# Your branch is up to date with 'origin/main'.
#
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git restore <file>..." to discard changes in working directory)
#         modified:   index.html
#
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
#         new-file.txt
#
# no changes added to commit (use "git add" and/or "git commit -a")
```

**What it shows:**
- Current branch name
- Files that have been modified
- Files staged for commit
- Untracked files
- Relationship to remote branch

---

## git add

**Purpose:** Adds file changes to the staging area, preparing them for a commit.

**Usage:**
```bash
git add <file>
git add <file1> <file2> <file3>
git add .
git add -A
```

**Examples:**
```bash
# Add a specific file
git add index.html

# Add multiple specific files
git add index.html style.css script.js

# Add all files in the current directory and subdirectories
git add .

# Add all changes in the entire repository
git add -A

# Add all files with a specific extension
git add *.js

# Add all files in a specific directory
git add src/
```

**What it does:**
- Stages changes for the next commit
- Doesn't affect the repository until you commit
- Can be used to stage new files, modifications, or deletions

---

## git commit

**Purpose:** Records the staged changes to the repository with a descriptive message.

**Usage:**
```bash
git commit -m "commit message"
git commit -am "commit message"
```

**Examples:**
```bash
# Commit staged changes with a message
git commit -m "Add user authentication feature"

# Commit with a multi-line message
git commit -m "Fix login bug" -m "Users can now login with email or username"

# Stage all modified files and commit in one command
git commit -am "Update documentation"

# Open default editor for detailed commit message
git commit

# Amend the last commit (change message or add forgotten files)
git add forgotten-file.txt
git commit --amend -m "Updated commit message"
```

**Best practices for commit messages:**
- Use present tense ("Add feature" not "Added feature")
- Be concise but descriptive
- First line should be 50 characters or less
- Explain what and why, not how

---

## git push

**Purpose:** Uploads local repository commits to a remote repository.

**Usage:**
```bash
git push <remote> <branch>
git push
```

**Examples:**
```bash
# Push commits to the main branch on origin
git push origin main

# Push commits to the current branch
git push

# Push a new branch to remote
git push -u origin feature-branch

# Push all branches
git push --all

# Force push (use with caution!)
git push --force

# Push tags
git push --tags
```

**What it does:**
- Sends your local commits to the remote repository
- Updates the remote branch with your changes
- Requires write access to the remote repository
- May require authentication

**Note:** Use `git push -u origin <branch>` for the first push of a new branch to set up tracking.

---

## git pull

**Purpose:** Fetches changes from a remote repository and merges them into your current branch.

**Usage:**
```bash
git pull <remote> <branch>
git pull
```

**Examples:**
```bash
# Pull changes from the main branch
git pull origin main

# Pull changes from the current branch's remote tracking branch
git pull

# Pull with rebase instead of merge
git pull --rebase

# Pull from a specific remote and branch
git pull upstream develop

# Pull all branches
git fetch --all
```

**What it does:**
- Fetches changes from the remote repository
- Automatically merges changes into your current branch
- Equivalent to running `git fetch` followed by `git merge`
- Updates your local repository with remote changes

**Note:** Always commit or stash your local changes before pulling to avoid conflicts.

---

## Common Workflow Example

Here's a typical workflow using these commands together:

```bash
# 1. Clone a repository (or initialize a new one)
git clone https://github.com/username/project.git
cd project

# 2. Check the status
git status

# 3. Make changes to files, then check status again
# ... edit files ...
git status

# 4. Stage the changes
git add .

# 5. Commit the changes
git commit -m "Add new feature"

# 6. Pull latest changes from remote (before pushing)
git pull

# 7. Push your changes to remote
git push

# 8. Check status to confirm everything is synchronized
git status
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialize a new repository |
| `git clone <url>` | Clone a remote repository |
| `git status` | Check repository status |
| `git add <file>` | Stage changes |
| `git commit -m "message"` | Commit staged changes |
| `git push` | Upload commits to remote |
| `git pull` | Download and merge remote changes |

---

## Additional Tips

- Use `git status` frequently to understand your repository state
- Always write meaningful commit messages
- Pull before you push to avoid conflicts
- Commit small, logical changes rather than large batches
- Use `.gitignore` to exclude files you don't want to track

For more advanced Git commands and features, refer to the [official Git documentation](https://git-scm.com/doc).
