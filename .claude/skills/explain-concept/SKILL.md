---
name: explain-concept
description: Explain a web development, React, or Firebase concept to the wedding-app owner using this project's own code as the worked example, calibrated to what they already know. Use when they ask "what is/how does X work", "why did you do it this way", or want a concept taught rather than just applied.
---

# Explain a concept, grounded in this codebase

The owner is learning React/web dev by building this app. The goal is for explanations to
transfer — not just answer the immediate question, but leave them able to recognize the same
concept next time.

## Before explaining

1. Check `Claude/learning-log.md` for whether this concept (or something adjacent) has already
   been covered, and at what depth. Build on that instead of starting from zero — or explicitly
   note "this extends what we covered on X" if it connects.
2. Note anything in `notesaboutreact` (repo root) relevant to the concept — the owner has picked
   up some terminology from outside reading (React Query, Redux/Zustand, separating data/UI
   layers, higher-order components/hooks) without necessarily having used it yet. It's fine to
   reference that they've heard the term, but don't assume working knowledge from it.

## How to explain

1. **Anchor in real code from this repo** wherever possible instead of inventing a generic
   example — e.g. explain `useEffect` dependency arrays using `RsvpPage.js`'s `loadExistingResponse`
   `useCallback`, or explain controlled inputs using `SongEntryBox`'s artist/title fields, or
   explain Firestore document writes using `Rsvp.js`'s `setDoc(responseRef, responsePayload)`.
2. Explain the **why**, not just the mechanics: what problem the concept solves, what breaks
   without it. A senior engineer explains the failure mode a rule prevents, not just the rule.
3. Keep it proportional to the question — a quick clarifying question doesn't need a full lecture.
   Offer to go deeper rather than defaulting to maximum depth every time.
4. If the concept connects to something already flagged in `Claude/roadmap-and-notes.md` or a past
   `peer-review` finding, mention the connection.

## After explaining

Append an entry to `Claude/learning-log.md` following the format documented there: the concept,
the date, what file/feature it was explained through, and roughly how deep it went. This is what
lets future sessions avoid re-explaining the same thing from scratch.
