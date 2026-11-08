# Architecture

## Folder layout

- `src/pages/`: routed, top-level screens, one per `<Route>` in `App.js`.
- `src/reactComponents/`: shared layout components plus the RSVP sub-steps. `RsvpPage`,
  `DietPage` and `SongPage` are steps of one flow, not general-purpose components.
- `src/images/`: background images bundled by webpack. Carousel photos are served from Cloudinary
  instead (see Home below).
- `src/firebase.js`: Firebase app initialization. Exports `db` (Firestore) only.

## Routing (`src/App.js`)

| Path             | Component       |
|------------------|-----------------|
| `/`              | `Home`          |
| `/schedule`      | `Schedule`      |
| `/ourstory`      | `About`         |
| `/q+a`           | `Questions`     |
| `/accommodation` | `Accommodation` |
| `/rsvp`          | `Rsvp`          |

`App.js` uses `reactComponents/Navbar.js` as the site navigation. It also swaps the background
with Tailwind responsive classes: a desktop image at `lg:` and above, and below `lg:` a mobile
image rendered twice (stacked, the second rotated 180°).

## Shared layout

- `ContentWrapper` composes `PageHeader` + `InsideArchDiv` + `ArchedTextBox`. The informational
  pages (`About`, `Schedule`, `Accommodation`, `Questions`) are built on it.
- `Questions` renders a list of `FAQItem` accordions.
- The arch shapes come from plain CSS (`App.css`, `pages/Arch.css`, `pages/ArchedText.css`).

## Home (`src/pages/Home.js`)

An image carousel served by Cloudinary:

- A `Cloudinary` instance is built from `REACT_APP_CLOUDINARY_CLOUD_NAME`.
- Each public ID is transformed with `fill().width(1200).height(600).gravity("faces")` and
  `format('auto')`.
- A spinner shows until every image has preloaded (a `new Image()` per URL in a `useEffect`).
- A `setInterval` advances `currentIndex` every 5 seconds. Its cleanup function clears the
  interval.
- Slides cross-fade by toggling opacity classes on stacked `<AdvancedImage>` elements.

## RSVP flow

`src/pages/Rsvp.js` owns all the state for the multi-step form:

- `name`, `selectedGuest`, `partyMembers`, `rsvpStatus`
- `dietaryRequirements`, `songRequests`
- `currentPage`, `submitStatus`, `isSubmitting`

`getCurrentPage()` picks the step to render:

1. **Page 0, `RsvpPage`**: guest lookup.
   - Loads the entire `invitations` collection once on mount, then searches it client-side (see
     `conventions.md`).
   - Selecting a guest loads their whole party, with yes/no buttons per member.
   - The party list uses a `grid-cols-[1fr_auto]` layout so the button columns line up whatever
     the name length.
   - "Change Guest" resets the selection and clears all form state.
2. **Pages 1..N, `DietPage`**: one page per party member, with free-text dietary requirements.
   The member is found by `dietIndex = currentPage - 1`.
3. **Last page, `SongPage`**: "play" and "don't play" lists, each with an artist + title input
   (`SongEntryBox`). Backed by `songRequests: { yes: [], no: [] }`.

The Back, Next and Submit buttons are hidden (not disabled) when they don't apply.

**Submission** (`handleSubmit` in `Rsvp.js`):
- `setDoc` writes one document to `responses/{partyIdentifier}`, so a resubmission overwrites
  instead of duplicating.
- On success, the component shows a thank-you screen. On failure, it shows an error screen.

**Session resumption:**
- After submitting, `partyIdentifier` is cached in `localStorage`.
- On a return visit, `RsvpPage` restores the party from that cache once `invitations` has loaded,
  and `loadExistingResponse` fetches the earlier answers.
- In development, the cache is cleared on mount so local testing never starts from stale state.

## Firebase

- `firebase.js` initializes `firebase/app` and exports `db` from `firebase/firestore`. Nothing
  else.
- **Authentication is not active.** Guests are identified only by matching their typed name
  against `invitations`.
- `firebaseui` is still listed in `package.json` but isn't used. Adding sign-in would mean
  initializing and exporting Firebase Auth from `firebase.js`.

## Not wired up

These files exist but aren't routed or imported anywhere:

- **Empty:** `pages/Gifts.js`, a planned registry page.
- **Have content:** `pages/Diet.js`, `reactComponents/FormCard.js`, `SongInput.js`,
  `InnerArchDiv.js`.

Don't assume any of these are part of the running app. The mobile hamburger menu is built into
`reactComponents/Navbar.js`. There's no separate menu component.

## Config

Environment variables live in CRA env files (`.env`, `.env.development`, `.env.production`,
`.env.test`), all gitignored. A fresh clone needs them recreated:

- `REACT_APP_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`,
  `_MESSAGING_SENDER_ID`, `_APP_ID`
- `REACT_APP_CLOUDINARY_CLOUD_NAME`
