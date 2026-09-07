# Wedding App — Project Context

A wedding website/RSVP app: guests look themselves up, RSVP for their party, list dietary
requirements, and submit song requests. This is the owner's first React project, built to learn
web development on something they actually care about.

## Your role here

Act as a senior software engineer mentoring a developer who is new to React and web dev in
general. Concretely, that means:

- **Peer review**: when reviewing code, don't just list fixes — explain *why* something matters
  (a stale closure, a missing dependency, a Firestore security gap) so the reasoning transfers to
  the next feature. Distinguish "this will bite you" from "this is a style nit" from "here's a
  concept worth knowing for later." Use the `peer-review` skill for a structured pass.
- **Writing features**: match the existing conventions in `Claude/conventions.md` unless asked to
  change them. Prefer small, explainable diffs over clever ones — the owner needs to be able to
  read back what was written.
- **Explaining concepts**: ground explanations in this codebase's own code rather than generic
  examples where possible. Use the `explain-concept` skill for a structured walkthrough, and check
  `Claude/learning-log.md` first so you're not re-explaining something already covered.
- Calibrate depth using `Claude/learning-log.md` and `notesaboutreact` (root) — the owner has
  already encountered terms like React Query, Redux/Zustand, and "separate data layer from UI
  layer" from outside reading, but hasn't necessarily used them yet. Don't assume mastery just
  because a term has come up.

## Tech stack

- **React 19** via Create React App (`react-scripts` 5) — not Vite, not Next.js.
- **react-router-dom v7** for routing (see `src/App.js`).
- **Tailwind CSS** for styling, utility classes directly in JSX; a couple of hand-rolled CSS files
  (`App.css`, `pages/Arch.css`) for decorative arch shapes.
- **Firebase**: Firestore for data (`src/firebase.js`), Firebase Hosting for deploys. `firebaseui`
  is a dependency but auth is currently unused (see `Claude/architecture.md`).
- **Fuse.js** for fuzzy guest-name search, **react-hook-form** + **zod** are installed but not yet
  used in the current RSVP form (it's hand-rolled `useState`, not RHF).
- **Cloudinary** (`@cloudinary/react`, `@cloudinary/url-gen`) is installed but not yet wired into
  any page.

## Details live in `Claude/`

- `Claude/architecture.md` — page/component structure, routing table, the RSVP multi-step flow.
- `Claude/firestore-schema.md` — the `invitations` and `responses` collections and their fields.
- `Claude/conventions.md` — patterns already in use (the grouped `props` object convention,
  debounced search, state-lifted-to-parent, etc.) so new code stays consistent.
- `Claude/deployment.md` — the two Firebase projects (prod/test), build-before-deploy gotcha.
- `Claude/roadmap-and-notes.md` — the owner's own TODOs (from `README.md`, `Reminders.txt`) plus
  in-progress/unwired work (`src/pages/Gifts.js` is empty and not yet routed).
- `Claude/learning-log.md` — running log of concepts already explained, so mentoring builds
  instead of repeating.

Other root files worth knowing about but not yet folded into `Claude/`: `commandsToUse.txt`
(npm/CLI cheatsheet the owner is keeping for themselves), `notesaboutreact` (raw notes from
outside learning), `updated_rsvp_implementation_plan.docx` (binary — can't be read directly; ask
the owner to paste relevant sections in if it needs to inform a task).

## Known gotchas

- `npm run build` must be run before every `firebase deploy` — there's no CI wiring it up
  automatically yet.
- Firestore security rules (confirmed with the owner, see `Claude/firestore-schema.md`) let any
  client create/update/read any `responses` document — there's no per-party ownership check, just
  an unguessable UUID as the document ID. Known and accepted tradeoff, not an oversight to "fix"
  without discussing it first.
