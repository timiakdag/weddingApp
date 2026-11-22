# Architecture

## Folder layout

- `src/pages/`: routed, top-level screens, one per `<Route>` in `App.jsx`.
- `src/reactComponents/`: shared layout components plus the RSVP sub-steps. `RsvpPage`,
  `DietPage` and `SongPage` are steps of one flow, not general-purpose components.
- `src/images/`: background images bundled by Vite (output with hashed names in `dist/assets/`).
  Carousel photos are served from Cloudinary instead (see Home below).
- `src/firebase.js`: Firebase app initialization. Exports `db` (Firestore) only.
- `public/`: static files copied to the site root unchanged (`favicon.ico`, `manifest.json`, logos).
  `/favicon.ico` in HTML refers to `public/favicon.ico`.

## Build tooling

- **Vite** (`vite.config.mjs`, with `@vitejs/plugin-react`). `index.html` sits at the repo root
  and is the entry point: Vite starts there and bundles everything that
  `<script type="module" src="/src/index.jsx">` imports. Output goes to `dist/`.
- Files containing JSX must be `.jsx`, because Vite won't parse JSX in `.js` files. Plain JS
  modules (`firebase.js`, `rsvpReducer.js`) stay `.js`. Imports omit the extension.
- **PostCSS** (`postcss.config.js`) runs Tailwind and Autoprefixer on CSS. CRA used to do this
  implicitly, but Vite needs the config file. Without it the site builds with no Tailwind styles
  and no error.
- **ESLint** (`eslint.config.mjs`, flat config): `@eslint/js` recommended rules plus
  `eslint-plugin-react-hooks` (which includes `exhaustive-deps` and the React Compiler rules such
  as `set-state-in-effect`). Browser globals apply to `src/`, Node globals to the CommonJS
  `*.config.js` files. Builds don't run it, so use `npm run lint`.
- Config files that use `import`/`export` are `.mjs`, because `package.json` has no
  `"type": "module"`. Tailwind and PostCSS configs stay CommonJS `.js`.
- No test runner. The CRA Jest setup was removed during the migration. Vitest would be the
  natural choice, and `rsvpReducer.js` is the easiest first target.

## Routing (`src/App.jsx`)

| Path             | Component       |
|------------------|-----------------|
| `/`              | `Home`          |
| `/schedule`      | `Schedule`      |
| `/ourstory`      | `About`         |
| `/q+a`           | `Questions`     |
| `/accommodation` | `Accommodation` |
| `/rsvp`          | `Rsvp`          |

`App.jsx` uses `reactComponents/Navbar.jsx` as the site navigation. It also swaps the background
with Tailwind responsive classes: a desktop image at `lg:` and above, and below `lg:` a mobile
image rendered twice (stacked, the second rotated 180°).

## Shared layout

- `ContentWrapper` composes `PageHeader` + `InsideArchDiv` + `ArchedTextBox`. The informational
  pages (`About`, `Schedule`, `Accommodation`, `Questions`) are built on it.
- `Questions` renders a list of `FAQItem` accordions.
- The arch shapes come from plain CSS (`App.css`, `pages/Arch.css`, `pages/ArchedText.css`).

## Home (`src/pages/Home.jsx`)

An image carousel served by Cloudinary:

- A `Cloudinary` instance is built from `import.meta.env.VITE_CLOUDINARY_CLOUD_NAME`.
- Each public ID is transformed with `fill().width(1200).height(600).gravity("faces")` and
  `format('auto')`.
- A spinner shows until every image has preloaded (a `new Image()` per URL in a `useEffect`).
- A `setInterval` advances `currentIndex` every 5 seconds. Its cleanup function clears the
  interval.
- Slides cross-fade by toggling opacity classes on stacked `<AdvancedImage>` elements.

## RSVP flow

`src/pages/Rsvp.jsx` owns all the state for the multi-step form:

- **`useReducer(rsvpReducer)`** (`src/pages/rsvpReducer.js`): the response being built, made up
  of `selectedGuest`, `partyMembers`, `additionalGuests`, `rsvpStatus`, `dietaryRequirements` and
  `songRequests`. Actions: `partySelected`, `responseLoaded`, `partyCleared`, `guestStatusSet`,
  `additionalGuestNamed`, `dietChanged`, `songAdded`, `songRemoved`. The reducer enforces the
  rules that span fields, and `responseLoaded` ignores a response for a party that is no longer
  selected.
- **`useState`**: `name` (search text), `currentPage`, and
  `submitStatus` (`"idle" | "submitting" | "success" | "error"`).
- **Derived on each render**: in `Rsvp.jsx`, `everyone` (party members plus named extra guests,
  saved as `partyMembers`) and `attendees` (the subset with `rsvpStatus` "yes", one diet page
  each). In `RsvpPage.jsx`, `sessionState` (`"party"` when `partyMembers` is non-empty,
  otherwise `"search"`).

`RsvpPage` and `SongPage` receive `dispatch`. `DietPage` receives an `onDietaryChange` callback.

`getCurrentPage()` picks the step to render:

1. **Page 0, `RsvpPage`**: guest lookup.
   - Loads the entire `invitations` collection once on mount, then searches it client-side (see
     `conventions.md`).
   - Selecting a guest loads their whole party, with yes/no buttons per member.
   - The party list uses a `grid-cols-[1fr_auto]` layout so the button columns line up whatever
     the name length.
   - "Change Guest" resets the selection and clears all form state.
2. **Pages 1..N, `DietPage`**: one page per entry in `attendees` (guests answering "yes",
   including named extra guests), with free-text dietary requirements. The guest is found by
   `dietIndex = currentPage - 1`. Answering "no" also clears that guest's dietary entry.
3. **Last page, `SongPage`**: "play" and "don't play" lists, each with an artist + title input
   (`SongEntryBox`). Backed by `songRequests: { yes: [], no: [] }`.

The Back, Next and Submit buttons are hidden (not disabled) when they don't apply.

**Submission** (`handleSubmit` in `Rsvp.jsx`):
- `setDoc` writes one document to `responses/{partyIdentifier}`, so a resubmission overwrites
  instead of duplicating.
- On success, the component shows a thank-you screen. On failure, it shows an error screen.

**Session resumption:**
- After submitting, `partyIdentifier` is cached in `localStorage`.
- On a return visit, `RsvpPage` restores the party from that cache once `invitations` has loaded,
  and `loadExistingResponse` fetches the earlier answers.
- `RsvpPage` remounts every time the guest returns to step 0, so the restore skips when
  `partyMembers` is already populated. Without that check, Back would overwrite unsubmitted
  answers with the saved response.
- Under `npm run dev` (`import.meta.env.DEV`), the cache is cleared on mount so local testing
  never starts from stale state. To test the restore locally, use a build with `npm run preview`.

## Firebase

- `firebase.js` initializes `firebase/app` and exports `db` from `firebase/firestore`. Nothing
  else.
- **Authentication is not active.** Guests are identified only by matching their typed name
  against `invitations`.
- `firebase` (v13) is a direct dependency. `firebaseui` was removed on 2026-11-22: it was unused
  and only supports Firebase 9/10. Adding sign-in would mean initializing and exporting Firebase
  Auth from `firebase.js`, and choosing a UI library that supports the current Firebase version.

## Not wired up

These files exist but aren't routed or imported anywhere:

- **Empty:** `pages/Gifts.js`, a planned registry page.
- **Have content:** `reactComponents/FormCard.jsx`, `SongInput.jsx`,
  `InnerArchDiv.jsx`.

Don't assume any of these are part of the running app. The mobile hamburger menu is built into
`reactComponents/Navbar.jsx`. There's no separate menu component.

## Config

Environment variables live in Vite env files (`.env`, `.env.development`, `.env.production`,
`.env.test`), all gitignored. Vite loads `.env` plus `.env.<mode>`: `development` for
`npm run dev`, `production` for `npm run build`, `test` for `npm run build:test`. Only `VITE_`
variables reach the code, through `import.meta.env`. A fresh clone needs them recreated:

- `VITE_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`,
  `_MESSAGING_SENDER_ID`, `_APP_ID` (per environment file)
- `VITE_CLOUDINARY_CLOUD_NAME` (in `.env`)
