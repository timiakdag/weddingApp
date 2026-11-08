# Wedding App — Project Context

A wedding website with a guest RSVP flow. Guests look themselves up by name, RSVP for every member
of their party, record dietary requirements, and submit song requests. The rest of the site is
informational pages (schedule, our story, FAQ, accommodation).

## Tech stack

- **React 19** on Create React App (`react-scripts` 5).
- **react-router-dom v7** for client-side routing (`src/App.js`).
- **Tailwind CSS 3** utility classes in JSX. Plain CSS files (`App.css`, `pages/Arch.css`,
  `pages/ArchedText.css`, `pages/Home.css`) cover the decorative arch shapes that are awkward to
  express as utilities.
- **Firebase**: Firestore is the datastore (`src/firebase.js` exports `db`). Firebase Hosting
  serves the site, with separate prod and test projects.
- **Cloudinary** (`@cloudinary/react`, `@cloudinary/url-gen`) serves the home-page image carousel
  in `src/pages/Home.js`, configured via `REACT_APP_CLOUDINARY_CLOUD_NAME`.
- **Fuse.js** for fuzzy guest-name search.
- Installed but not yet used: `react-hook-form`, `zod`, `@hookform/resolvers`, `firebaseui`,
  `axios`. The RSVP form is managed with plain `useState`.

## Architecture

- `src/pages/`: routed screens. `src/reactComponents/`: shared components and the RSVP sub-steps.
- Routes (`src/App.js`): `/` Home, `/schedule`, `/ourstory` (About), `/q+a` (Questions),
  `/accommodation`, `/rsvp`.
- Informational pages share a layout through `ContentWrapper` (`PageHeader` + `InsideArchDiv` +
  `ArchedTextBox`).
- `App.js` swaps the desktop and mobile background images with Tailwind responsive classes.

### RSVP flow

`src/pages/Rsvp.js` owns all form state (`selectedGuest`, `partyMembers`, `rsvpStatus`,
`dietaryRequirements`, `songRequests`, `currentPage`, submit status) and chooses the step to render:

1. **Step 0, `RsvpPage`**: loads the full `invitations` collection once, searches it client-side,
   then shows the matched party with yes/no buttons for each member.
2. **Steps 1..N, `DietPage`**: one step per party member, with a free-text dietary field.
3. **Final step, `SongPage`**: "play" and "don't play" lists of `{ artist, title }`.

On submit, `setDoc` writes a single document to `responses/{partyIdentifier}`, so resubmitting
overwrites the previous response instead of duplicating it. `partyIdentifier` is cached in
`localStorage` so a returning guest's party and earlier answers reload. That cache is cleared on
mount when `NODE_ENV === "development"`.

### Firestore data

- `invitations`: one document per guest. Fields: `guestId`, `fullName`, `partyIdentifier`,
  `partyMembers`, `allowedGuests`, `lookupNames`, `searchText`, `searchTokens` (unused), and
  `pages`. It is read-only from the client and populated outside the app.
- `responses`: one document per party, keyed by `partyIdentifier`. Fields: `updatedAt`,
  `selectedGuest`, `partyMembers`, `rsvpStatus` (by `guestId`), `dietaryRequirements` (by
  `guestId`), and `songRequests: { yes: [], no: [] }`.

### Not yet wired up

These files are on disk but not routed or imported: `pages/Gifts.js` (empty, a planned registry
page), `pages/Diet.js`, `reactComponents/FormCard.js`, `SongInput.js` and `InnerArchDiv.js`. The
site navigation, including the mobile hamburger menu, is `reactComponents/Navbar.js`.
Authentication is not active: `firebase.js` exports only `db`, so adding sign-in would start with
initializing Firebase Auth there.

## Conventions

- **RSVP step components take one grouped `props` object.** For example,
  `function RsvpPage({ props })` is called as `<RsvpPage props={{ name, setName, ... }} />`. This
  applies to `RsvpPage`, `DietPage`, `SongPage` and `SongEntryBox`. Other components destructure
  named props normally (`function PageHeader({ title, className })`). Match whichever style the
  surrounding code uses.
- **State is lifted to the parent.** Step components are presentational and call the setters they
  receive. There is no Context or external state library.
- **Search is tiered.** An exact normalized substring match against `lookupNames` runs first. Only
  if it finds nothing does a Fuse.js fuzzy search run (threshold 0.35). Input is debounced 250 ms
  through a `useRef` timer. Reuse this pattern for any other searchable list.
- **Styling is Tailwind first.** Use plain CSS only for shapes that utilities can't express well.
- **Data shapes are documented in comments.** Firestore-backed components open with a comment
  describing their state and document shape, because the project has no TypeScript or prop-types.

## Config and deployment

- Environment variables follow CRA's `.env` file convention (`.env`, `.env.development`,
  `.env.production`, `.env.test`, all gitignored). Required: `REACT_APP_FIREBASE_*` (see
  `src/firebase.js`) and `REACT_APP_CLOUDINARY_CLOUD_NAME`.
- Firebase aliases in `.firebaserc` are `prod` and `test`. `firebase.json` serves `build/` as a
  SPA, rewriting all routes to `index.html`.
- Deploy steps: `firebase use <prod|test>`, then `npm run build` (or `npm run build:test`, which
  uses `.env.test`), then `firebase deploy --only hosting`.

## Known gotchas

- **Build before every deploy.** There's no CI, so `firebase deploy` publishes whatever is in
  `build/`. Skipping `npm run build` ships a stale site.
- **Firestore rules are permissive by design.** `invitations` is client read-only. `responses`
  allows any client to create, update and read any document. The only protection is that the
  document ID is an unguessable UUID. This is an accepted tradeoff for a low-stakes RSVP site.
  Discuss it before tightening, because stricter ownership checks would need Firebase Auth or
  App Check.
- **The dev-mode `localStorage` clear** in the RSVP flow is intentional. Keep the
  `NODE_ENV` guard if you add more persisted state.

More detail, where present, is in `Claude/` (`architecture.md`, `firestore-schema.md`,
`conventions.md`, `deployment.md`).
