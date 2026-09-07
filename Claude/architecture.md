# Architecture

## Folder split

- `src/pages/` — top-level, routed screens (one per `<Route>` in `App.js`).
- `src/reactComponents/` — everything else: shared components and the sub-steps of the RSVP flow.
  The name is a bit misleading since some of these (`RsvpPage`, `DietPage`, `SongPage`) are really
  "steps," not generic shared components — worth knowing when deciding where a new file goes.

## Routing (`src/App.js`)

| Path             | Component              |
|------------------|-------------------------|
| `/`              | `Home`                  |
| `/schedule`      | `Schedule`              |
| `/ourstory`      | `About`                 |
| `/q+a`           | `Questions`             |
| `/accommodation` | `Accommodation`         |
| `/rsvp`          | `Rsvp`                  |

`src/pages/Gifts.js` exists but is an **empty file** and has no route or nav link yet — it's a
started-but-not-built page. Don't assume it's wired up.

Background images are two separate assets swapped via Tailwind responsive classes: a desktop
`background` shown at `lg:` and above, and a `mobbackground` shown (twice, stacked and one
rotated 180°) below `lg:`. This lives directly in `App.js`, not in a layout component.

## The RSVP flow

`Rsvp.js` is the orchestrator/state owner for the whole multi-step form. It owns all the state
(`selectedGuest`, `partyMembers`, `rsvpStatus`, `dietaryRequirements`, `songRequests`,
`currentPage`) and picks which step to render via `getCurrentPage()`:

1. **Page 0 — `RsvpPage`**: guest lookup. Loads the entire `invitations` collection once on mount,
   then does client-side search (see `conventions.md` for the tiered search logic) to find a
   guest, then shows their whole party with per-member Yes/No buttons.
2. **Pages 1..N — `DietPage`** (one per party member): a free-text dietary requirements box,
   `dietIndex = currentPage - 1`.
3. **Last page — `SongPage`**: two lists (songs wanted / not wanted), each with an artist+title
   input and an add/remove list, backed by `songRequests: { yes: [], no: [] }`.

Submission (`handleSubmit` in `Rsvp.js`) writes one document to the `responses` collection, keyed
by `partyIdentifier` (so resubmitting overwrites rather than duplicates). See
`firestore-schema.md` for the exact shape.

Session resumption: `partyIdentifier` is cached in `localStorage` so a guest who already
responded gets their party and prior answers reloaded automatically (`loadExistingResponse` in
`RsvpPage.js`). In development this cache is deliberately cleared on mount so you don't get stuck
testing against stale local state.

Child components (`RsvpPage`, `DietPage`, `SongPage`, and `SongEntryBox` inside `SongPage.js`) all
receive their inputs as a single grouped object called `props` — e.g.
`function RsvpPage({ props })` — rather than destructuring named props directly off the component
argument. It's consistent across the RSVP flow, so match it for new steps in this flow unless the
owner decides to change the pattern project-wide.

## Firebase setup (`src/firebase.js`)

Initializes `firebase/app`, `firebase/analytics`, and exports `db` from `firebase/firestore`.
`firebaseui` is still a dependency, but the scratch auth code that used to reference it
(`onAuthStateChanged`/`signOut`/`SignInForm`/`UserPanel`, commented out in `Rsvp.js`) was deleted
on 2026-09-07 along with the `SignInForm.js`/`UserPanel.js` files themselves — they referenced
`auth`/`googleProvider` exports that `firebase.js` never actually provided, so it was dead code
that would have broken the moment it was uncommented. Auth is **not currently active** — guests
RSVP without signing in, identified only by matching their typed name against `invitations`. If
auth is wanted later, it needs a fresh build: initializing and exporting `auth` from
`firebase.js`, not resuming the deleted files.

## Config

Firebase config values (`REACT_APP_FIREBASE_*`) come from `.env` / `.env.development` /
`.env.production` / `.env.test`, standard CRA env-file behavior. `.env.test` is untracked in git
per the current status — keep that in mind if it needs to be recreated on a fresh clone.
