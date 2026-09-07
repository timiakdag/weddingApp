# Conventions already in use

Match these in new code unless the owner asks to change the pattern — and if a pattern here looks
worth changing, raise it as a suggestion rather than silently deviating in one file.

## Grouped `props` object (RSVP flow only — not project-wide)

Components in the RSVP flow specifically (`RsvpPage`, `DietPage`, `SongPage`, `SongEntryBox`) take
a single object, conventionally named `props`, rather than destructuring individual props off the
component's argument. Everywhere else in the codebase (`PageHeader`, `FAQItem`, `InsideArchDiv`,
`ArchedTextBox`) uses normal destructured props
(`function PageHeader({ title, className })`) — the more typical React style. So this is a
localized convention, not a project-wide one; match it only when adding to the RSVP flow itself,
and use plain destructured props for new standalone components (including `Gifts.js`).

```js
function RsvpPage({ props }) {
  const name = props.name;
  const setName = props.setName;
  ...
}
```

and callers pass it as `<RsvpPage props={{ name, setName, ... }} />`. This is unusual relative to
typical React style (normally you'd just destructure named props directly), but it's consistent
across `RsvpPage`, `DietPage`, `SongPage`, and `SongEntryBox` — so extend it for new steps in this
flow rather than mixing styles. Worth a conversation with the owner at some point about whether to
standardize on plain destructured props project-wide, but that's a deliberate refactor decision,
not something to change opportunistically.

## State lives in the parent, flows down

`Rsvp.js` owns all the multi-step form state and passes setters down; child steps are fairly
"dumb" and just call the setters they're given. No Context, Redux, or Zustand in use yet, even
though those terms show up in the owner's own learning notes (`notesaboutreact` at repo root) —
this app hasn't needed them yet given how shallow the tree is. Worth raising if a feature actually
needs cross-tree state sharing, not before.

## Search: tiered exact-then-fuzzy

`RsvpPage.js` searches guests in two tiers: `tier1Search` does a normalized (lowercased,
punctuation-stripped) substring match against `lookupNames`, and only falls back to `tier2Search`
(Fuse.js fuzzy search over `searchText`/`lookupNames`/`fullName`, threshold 0.35) if tier 1 finds
nothing. Input is debounced 250ms via a `setTimeout` held in a `useRef`. Follow this same
tiered-then-fuzzy shape for any other searchable list added later.

## Styling

Tailwind utility classes written directly in JSX is the default. A couple of decorative pieces
(arch shapes) use plain CSS files (`pages/Arch.css`, `App.css`) instead — reach for Tailwind first
and only drop to plain CSS for effects that are awkward to express in utilities.

## Persistence

`localStorage` is used for exactly one thing: caching `partyIdentifier` so a returning guest skips
the search step. It's deliberately cleared on mount in development (`Rsvp.js`/`RsvpPage.js`
guarded by `process.env.NODE_ENV === "development"`) so local testing doesn't get stuck on stale
state — keep that guard in mind if adding more localStorage usage.

## Comments as data-shape documentation

`Rsvp.js` and `DietPage.js` both open with a comment block describing the shape of the state/props
they work with (e.g. the `invitations` fields, `partyMembers = { fullName, guestId }`). This is a
useful pattern for Firestore-backed state where the shape isn't visible from types — continue it
for new Firestore-shaped state rather than relying on prop-types or TypeScript (neither is set up
in this project).
