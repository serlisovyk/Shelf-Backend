# Merge locally into `main`, no pull requests

Date: 2026-11-07 · Status: accepted

## Context

The repo has a single author. Pull requests were considered as the merge path; the author reviews
each task's report and approves it in chat instead.

## Decision

- Each task is developed on a `my-<n>-<slug>` branch with an English slug, never Linear's
  `gitBranchName`, in its own worktree under `.claude/worktrees/` when tasks run in parallel.
- After the author approves, the branch is rebased onto `main`, fast-forward merged locally, checked
  again, and `main` is pushed. No pull requests.
- Feature branches are not pushed to GitHub: only `main` is.
- CI runs on every push to `main` as a post-push signal, not as a merge gate. The pre-merge gate is
  the local checks.

## Consequences

- A red CI run on `main` means `main` is broken: fix it right away with a follow-up commit.
- History stays linear (rebase + `--ff-only`); `main` is never force-pushed.
- CI does not see a branch before the merge.
- Rejected: pull requests (a review step with nobody else to review, and a pushed branch per task).
