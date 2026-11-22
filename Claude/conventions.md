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

`Rsvp.jsx` owns the form state. The step components are presentational. They change the response
by calling the `dispatch` they're given (`RsvpPage`, `SongPage`) or a callback (`DietPage`'s
`onDietaryChange`). There's no Context, Redux or Zustand, because the component tree is shallow
enough not to need them. Reconsider only if a feature needs to share state across distant parts of
the tree.

## `useReducer` vs `useState`

- **`useReducer`** applies when a rule covers more than one value, so that one event has to update
  several of them consistently. The RSVP response (`rsvpReducer.js`) is the example. Naming an
  extra guest also sets their `rsvpStatus`, and a host's "no" removes the host's extra guests and
  those guests' answers. Name actions after what happened (`guestStatusSet`, `partyCleared`), and
  keep the reducer pure: no Firestore calls and no `localStorage` (do those in the component, then
  dispatch the result).
- **`useState`** applies to independent values: `currentPage`, search `results`, text inputs.
- **Merge, don't pair.** When two values are really one value with several states, use one
  `useState` holding a status string. `submitStatus` used to be a separate `isSubmitting` boolean.
- **Derive, don't store.** If a value can be computed from state or props (`attendees`,
  `sessionState`), compute it during render.

Changing the response shape or its rules means updating `rsvpReducer.js` and its header comment.

## Search: exact first, then fuzzy

The guest search in `RsvpPage.jsx` runs in two tiers:

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

Clean up anything an effect sets up. `Home.jsx` clears its carousel interval, and `RsvpPage.jsx`
clears its debounce timer on unmount. When a `useCallback` is used as an effect dependency, list
its own dependencies in full. `loadExistingResponse` in `RsvpPage.jsx` is an example.

## Persistence

`localStorage` is used for one thing only: caching `partyIdentifier` so a returning guest skips the
search step. `RsvpPage.jsx` clears it on mount when `import.meta.env.DEV` is true so
local testing doesn't start from stale state. Keep that guard if you add more persisted state.

## Comments as data-shape documentation

`Rsvp.jsx`, `rsvpReducer.js` and `DietPage.jsx` open with a comment block describing the shape of their state and the
Firestore documents they use. The project has no TypeScript or prop-types, so add the same kind of
comment to new Firestore-backed state.

## Environment variables

All client config goes through `VITE_*` variables in Vite's `.env` files, read with
`import.meta.env.VITE_*`, never hard-coded values. Examples are the Firebase config in
`firebase.js` and the Cloudinary cloud name in `Home.jsx`. Anything prefixed `VITE_` is shipped
in the public bundle, so the prefix is only for values that are safe to expose. For
environment checks, use `import.meta.env.DEV` / `.PROD` / `.MODE` rather than `process.env`.

## File extensions and linting

- Components and any file containing JSX are `.jsx`. Plain JS modules are `.js`. Vite rejects
  JSX in a `.js` file with "Unexpected JSX expression".
- Leave the extension off imports (`import Rsvp from "./pages/Rsvp"`), as the existing code does.
- Run `npm run lint` before building to deploy. Treat `react-hooks/exhaustive-deps` warnings
  as real, and add the missing dependency rather than silencing the rule.
