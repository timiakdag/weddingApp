# Wedding App — Project Context

A wedding website with a guest RSVP flow. Guests look themselves up by name, RSVP for every member
of their party, record dietary requirements, and submit song requests. The rest of the site is
informational pages (schedule, our story, FAQ, accommodation).

## Tech stack

- **React 19** built with **Vite** (`vite.config.mjs`, `@vitejs/plugin-react`). Migrated from
  Create React App. Vite's entry point is `index.html` at the repo root, which loads
  `src/index.jsx`. Files containing JSX use the `.jsx` extension.
- **react-router-dom v7** for client-side routing (`src/App.jsx`).
- **Tailwind CSS 3** utility classes in JSX, run through PostCSS (`postcss.config.js`). Plain CSS files (`App.css`, `pages/Arch.css`,
  `pages/ArchedText.css`, `pages/Home.css`) cover the decorative arch shapes that are awkward to
  express as utilities.
- **Firebase**: Firestore is the datastore (`src/firebase.js` exports `db`). Firebase Hosting
  serves the site, with separate prod and test projects.
- **Cloudinary** (`@cloudinary/react`, `@cloudinary/url-gen`) serves the home-page image carousel
  in `src/pages/Home.jsx`, configured via `VITE_CLOUDINARY_CLOUD_NAME`.
- **Fuse.js** for fuzzy guest-name search.
- **ESLint 10** (flat config in `eslint.config.mjs`) with `eslint-plugin-react-hooks`. Run it
  with `npm run lint`. There is no test runner yet.
- Installed but not yet used: `react-hook-form`, `zod`, `@hookform/resolvers`, `axios`. The RSVP
  form is managed with React's built-in `useReducer` and `useState`.

## Architecture

- `src/pages/`: routed screens. `src/reactComponents/`: shared components and the RSVP sub-steps.
- Routes (`src/App.jsx`): `/` Home, `/schedule`, `/ourstory` (About), `/q+a` (Questions),
  `/accommodation`, `/rsvp`.
- Informational pages share a layout through `ContentWrapper` (`PageHeader` + `InsideArchDiv` +
  `ArchedTextBox`).
- `App.jsx` swaps the desktop and mobile background images with Tailwind responsive classes.

### RSVP flow

`src/pages/Rsvp.jsx` owns all form state and chooses the step to render. The response being built
(`selectedGuest`, `partyMembers`, `additionalGuests`, `rsvpStatus`, `dietaryRequirements`,
`songRequests`) lives in one `useReducer` defined in `src/pages/rsvpReducer.js`. `currentPage`,
`submitStatus` and the search text stay as `useState`.

1. **Step 0, `RsvpPage`**: loads the full `invitations` collection once, searches it client-side,
   then shows the matched party with yes/no buttons for each member.
2. **Steps 1..N, `DietPage`**: one step per attending guest (`rsvpStatus` "yes", including named
   extra guests), with a free-text dietary field.
3. **Final step, `SongPage`**: "play" and "don't play" lists of `{ artist, title }`.

On submit, `setDoc` writes a single document to `responses/{partyIdentifier}`, so resubmitting
overwrites the previous response instead of duplicating it. `partyIdentifier` is cached in
`localStorage` so a returning guest's party and earlier answers reload. That cache is cleared on
mount when `import.meta.env.DEV` is true (`npm run dev`).

### Firestore data

- `invitations`: one document per guest. Fields: `guestId`, `fullName`, `partyIdentifier`,
  `partyMembers`, `allowedGuests`, `lookupNames`, `searchText`, `searchTokens` (unused), and
  `pages`. It is read-only from the client and populated outside the app.
- `responses`: one document per party, keyed by `partyIdentifier`. Fields: `updatedAt`,
  `selectedGuest`, `partyMembers`, `rsvpStatus` (by `guestId`), `dietaryRequirements` (by
  `guestId`), and `songRequests: { yes: [], no: [] }`. `partyMembers` also holds any extra guests
  a party named (up to each guest's `allowedGuests`). These are flagged
  `isAdditionalGuest: true` with a `hostGuestId`, and have the deterministic ID
  `<hostGuestId>-guest-<i>`. A named extra guest is recorded as attending.

### Not yet wired up

These files are on disk but not routed or imported: `pages/Gifts.js` (empty, a planned registry
page), `reactComponents/FormCard.jsx`, `SongInput.jsx` and `InnerArchDiv.jsx`. The
site navigation, including the mobile hamburger menu, is `reactComponents/Navbar.jsx`.
Authentication is not active: `firebase.js` exports only `db`, so adding sign-in would start with
initializing Firebase Auth there.

## Conventions

- **RSVP step components take one grouped `props` object.** For example,
  `function RsvpPage({ props })` is called as `<RsvpPage props={{ name, setName, ... }} />`. This
  applies to `RsvpPage`, `DietPage`, `SongPage` and `SongEntryBox`. Other components destructure
  named props normally (`function PageHeader({ title, className })`). Match whichever style the
  surrounding code uses.
- **State is lifted to the parent.** Step components are presentational. They send changes to the
  response through the `dispatch` they receive, or through a callback such as `onDietaryChange`.
  There is no Context or external state library.
- **`useReducer` when a rule spans several values, `useState` otherwise.** Response rules that span
  fields, such as "a host's no removes their extra guests and those guests' answers", live in
  `rsvpReducer.js` as named actions. Independent UI values (`currentPage`, search results, text
  inputs) use `useState`. Derive a value instead of storing it when it can be computed, as with
  `attendees` and `sessionState`.
- **Search is tiered.** An exact normalized substring match against `lookupNames` runs first. Only
  if it finds nothing does a Fuse.js fuzzy search run (threshold 0.35). Input is debounced 250 ms
  through a `useRef` timer. Reuse this pattern for any other searchable list.
- **Styling is Tailwind first.** Use plain CSS only for shapes that utilities can't express well.
- **Data shapes are documented in comments.** Firestore-backed components open with a comment
  describing their state and document shape, because the project has no TypeScript or prop-types.

## Config and deployment

- Environment variables use Vite's `.env` files (`.env`, `.env.development`, `.env.production`,
  `.env.test`, all gitignored). Only variables prefixed `VITE_` reach the app, through
  `import.meta.env`. Required: `VITE_FIREBASE_*` (see `src/firebase.js`) and
  `VITE_CLOUDINARY_CLOUD_NAME`. Every `VITE_` value is visible in the public bundle, so never use
  that prefix for a server-side secret.
- Scripts: `npm run dev` (dev server on port 5173; `npm start` is an alias), `npm run build`
  (production, uses `.env.production`), `npm run build:test` (`vite build --mode test`, uses
  `.env.test`), `npm run preview` (serves the last build locally), `npm run lint`.
- Firebase aliases in `.firebaserc` are `prod` and `test`. `firebase.json` serves `dist/` as a
  SPA, rewriting all routes to `index.html`.
- Deploy steps: `firebase use <prod|test>`, then `npm run build` (or `npm run build:test`), then
  `firebase deploy --only hosting`.

## Known gotchas

- **Build before every deploy.** There's no CI, so `firebase deploy` publishes whatever is in
  `dist/`. Skipping `npm run build` ships a stale site. Builds don't lint, so run `npm run lint`
  as well.
- **Firestore rules are permissive by design.** `invitations` is client read-only. `responses`
  allows any client to create, update and read any document. The only protection is that the
  document ID is an unguessable UUID. This is an accepted tradeoff for a low-stakes RSVP site.
  Discuss it before tightening, because stricter ownership checks would need Firebase Auth or
  App Check.
- **The dev-mode `localStorage` clear** in the RSVP flow is intentional. Keep the
  `import.meta.env.DEV` guard if you add more persisted state. Because of it, the returning-guest
  restore only runs in a build (`npm run build:test`, then `npm run preview`).

More detail, where present, is in `Claude/` (`architecture.md`, `firestore-schema.md`,
`conventions.md`, `deployment.md`).
