# Project Notes

This folder is for **communication between David and Jan** about video project tasks that aren't yet assigned to a specific repository.

## Purpose

- **Task assignments** - David creates notes for Jan about upcoming work
- **Project ideas** - Brainstorming before committing to a specific repo
- **Cross-repo coordination** - Tasks that span multiple video projects
- **Questions/discussions** - Back-and-forth communication

## How to Use

### For David (Creating Tasks):

1. Create a new markdown file with descriptive name:
   - `task-edit-rony-video.md`
   - `idea-new-aitldr-series.md`
   - `question-workflow-clarification.md`

2. Use this template:
   ```markdown
   # Task: [Brief Title]

   **Created**: 2025-10-30
   **For**: Jan
   **Priority**: High/Medium/Low
   **Related Repos**: v-aitldr, v-kiros, etc.

   ## Description
   [What needs to be done]

   ## Context
   [Why this is needed, any background]

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2

   ## Notes
   [Any additional information]
   ```

3. Commit and push to v-shared:
   ```bash
   cd v-shared
   git add project-notes/
   git commit -m "Add task: [brief description]"
   git push origin main
   ```

### For Jan (Working on Tasks):

1. Pull latest changes:
   ```bash
   cd v-shared
   git pull origin main
   ```

2. Read the task file in `project-notes/`

3. When you start work, add a comment:
   ```markdown
   ## Jan's Progress

   **Started**: 2025-10-30
   - Working on this now
   - Questions: [any questions for David]
   ```

4. When complete, update the file:
   ```markdown
   ## Completed

   **Date**: 2025-10-30
   **Location**: Changes committed to v-aitldr repository
   **Notes**: [any relevant notes about the work done]
   ```

5. Commit and push updates:
   ```bash
   cd v-shared
   git add project-notes/
   git commit -m "Complete task: [brief description]"
   git push origin main
   ```

## File Naming Convention

Use lowercase with hyphens:
- ✅ `task-edit-rony-american-voice.md`
- ✅ `idea-new-workflow-for-shorts.md`
- ✅ `question-final-folder-usage.md`
- ❌ `Task Edit Rony.md` (no spaces, no capitals)

## When to Move to Specific Repo

Once a task is clearly about ONE specific repo (e.g., v-aitldr), the conversation should move there:
- Create an issue in that repo's GitHub
- Or add notes to that repo's project folder
- Then archive or delete the note from `project-notes/`

## Archive Completed Tasks

**Option 1**: Move to `project-notes/archive/` folder
**Option 2**: Delete the file (it's in git history if needed)

Either way, keep this folder clean so it's easy to see **current active tasks**.

---

## Example Files

See `example-task.md` for a sample task file format.

---

Last updated: 2025-10-30
