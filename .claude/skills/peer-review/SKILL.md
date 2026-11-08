---
name: peer-review
description: Review recent or specified changes in this wedding-app repo the way a senior engineer mentoring a React beginner would - flagging real problems, explaining the why, and calling out concepts worth learning from, without dumping an overwhelming list. Use when the owner asks for a review, feedback, or "does this look right" on code in this project.
---

# Peer review (mentoring mode)

This project's owner is learning React and web development through this app. The goal of this
skill is not just to find bugs — it's to review the way a thoughtful senior engineer would review
a junior teammate's PR: honest, specific, and focused on building their judgment over time.

## Before reviewing

1. Read `Claude/conventions.md` and `Claude/architecture.md` so you're reviewing against this
   project's actual patterns, not generic React idioms it hasn't adopted (e.g. don't flag the
   grouped `props` object convention as wrong just because it's unusual — it's intentional here).
2. Skim `Claude/learning-log.md` so explanations build on what's already been covered instead of
   re-teaching it from zero.
3. Identify the diff or files in scope: if the owner names files, review those; otherwise default
   to the current uncommitted changes (`git diff` / `git status`), same as a normal code review.

## What to look for

- **Correctness bugs**: logic errors, off-by-one issues, stale closures, missing/incorrect
  `useEffect` dependencies, race conditions in async handlers, incorrect Firestore query/write
  usage (e.g. `setDoc` vs `addDoc` semantics, reading `.data()` before checking `.exists()`).
- **React fundamentals**: keys on lists, controlled vs uncontrolled inputs, unnecessary re-renders,
  state that should be derived instead of duplicated, effects that should be event handlers
  instead.
- **Firestore/data modeling**: does a change match `Claude/firestore-schema.md`? Does it introduce
  a new read/write pattern that should be documented there? Any obvious security implications
  (writes with client-supplied IDs, missing validation) worth flagging even if not fixing them now.
- **Consistency**: does new code match `Claude/conventions.md` (grouped props, tiered search
  pattern, Tailwind-first styling)? If it deviates, ask whether that's deliberate before assuming
  it's a mistake.
- **Accessibility and basic UX**: form labels, focus handling, disabled/loading states — this is a
  real site guests will use, not a toy project.

## How to report it

Group findings into three tiers, most important first:

1. **Will bite you** — actual bugs or correctness issues. Explain the failure scenario concretely
   (what input/sequence causes what wrong behavior), not just "this could be a problem."
2. **Worth fixing, not urgent** — style/consistency drift, missed edge cases, small
   maintainability issues.
3. **FYI / concept worth knowing** — something correct today that's a good moment to introduce a
   concept (e.g. why a dependency array matters, why `setDoc` overwrites, what a stale closure
   is). Keep these short and concrete, tied to the actual line of code, not a generic lecture.

Don't manufacture findings in a tier just to fill it out — an empty tier is a fine outcome. After
the review, if something genuinely new was explained in tier 3, add an entry to
`Claude/learning-log.md`.
