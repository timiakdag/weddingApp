# Conventions

Match these in new code. If a pattern seems worth changing, propose the change for the whole
project rather than breaking from it in one file.

## Grouped `props` object (RSVP flow only)

Each RSVP step component (`RsvpPage`, `DietPage`, `SongPage`, `SongEntryBox`) takes a single
object named `props` and reads values off it:

```js
function RsvpPage({ props }) {
  const name = props.name;
  const setName = props.setName;
  ...
}
```

Callers pass `<RsvpPage props={{ name, setName, ... }} />`.

Every other component destructures named props in the usual React style
(`function PageHeader({ title, className })`): `PageHeader`, `FAQItem`, `InsideArchDiv`,
`ArchedTextBox`, `ContentWrapper`. Use the grouped object only for new steps in the RSVP flow, and
plain destructured props everywhere else (for example `Gifts.js`). Moving the whole project to
destructured props would be a deliberate refactor, not something to do piecemeal.

## State lifted to the parent

`Rsvp.js` owns the form state and passes setters down. The step components are presentational and
call the setters they're given. There's no Context, Redux or Zustand, because the component tree
is shallow enough not to need them. Reconsider only if a feature needs to share state across
distant parts of the tree.

## Search: exact first, then fuzzy

The guest search in `RsvpPage.js` runs in two tiers:

1. `tier1Search` normalizes the query (lowercases it and strips everything except letters and
   spaces), splits it into tokens, and keeps guests whose `lookupNames` contain every token.
2. If tier 1 finds nothing, `tier2Search` falls back to Fuse.js over `searchText`, `lookupNames`
   and `fullName` (threshold 0.35, `ignoreLocation: true`).

Input is debounced 250 ms using a `setTimeout` stored in a `useRef`, and the timer is cleared on
unmount. Queries shorter than 2 characters return nothing. Use the same shape for any other
searchable list.

## Styling

Write Tailwind utility classes directly in JSX by default. Drop to plain CSS
(`App.css`, `pages/Arch.css`, `pages/ArchedText.css`, `pages/Home.css`) only for decorative shapes
that utilities can't express well.

## Effects and cleanup

Clean up anything an effect sets up. `Home.js` clears its carousel interval, and `RsvpPage.js`
clears its debounce timer on unmount. When a `useCallback` is used as an effect dependency, list
its own dependencies in full. `loadExistingResponse` in `RsvpPage.js` is an example.

## Persistence

`localStorage` is used for one thing only: caching `partyIdentifier` so a returning guest skips the
search step. `RsvpPage.js` clears it on mount when `process.env.NODE_ENV === "development"` so
local testing doesn't start from stale state. Keep that guard if you add more persisted state.

## Comments as data-shape documentation

`Rsvp.js` and `DietPage.js` open with a comment block describing the shape of their state and the
Firestore documents they use. The project has no TypeScript or prop-types, so add the same kind of
comment to new Firestore-backed state.

## Environment variables

All client config goes through `REACT_APP_*` variables in CRA env files, never hard-coded
values. Examples are the Firebase config in `firebase.js` and the Cloudinary cloud name in
`Home.js`.
