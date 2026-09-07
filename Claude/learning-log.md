# Learning log

Purpose: avoid re-explaining the same concept from scratch every session, and track what the
owner already has some exposure to versus what's genuinely new. The `explain-concept` skill
should check this file before explaining something, and append an entry after.

Starting context (from the owner's own `notesaboutreact` file at repo root): they've encountered
the *terms* state-driven UI, separating a data layer from a UI layer, React Query, higher-order
components/hooks, and Redux/Zustand from outside reading — but nothing in this codebase uses those
yet, so treat that as "has heard of it," not "has used it."

## Format

Add one entry per concept explained:

```
### <concept> — YYYY-MM-DD
Explained in the context of: <file/feature>
Depth: <brief note on how deep this went>
Follow-ups the owner may want later: <optional>
```

## Entries

### Calling a function vs. referencing it in JSX conditionals — 2026-09-07
Explained in the context of: `showSubmitButton && (...)` in [Rsvp.js:228](src/pages/Rsvp.js#L228),
found during a full-project peer review.
Depth: `showSubmitButton` (no parens) is the function itself, which is always a truthy object in
JS — so `showSubmitButton && (<input .../>)` always renders the submit button, regardless of what
the function's logic says. Needed `showSubmitButton()` to actually invoke it and get the boolean.
Contrasted with the correct calls right above it (`showPrevButton()`, `showNextButton()`) to show
the same file has both the correct and incorrect pattern side by side.
Follow-ups the owner may want later: worth a quick self-check pass over other conditional renders
in the RSVP flow for the same `fn &&` vs `fn() &&` mistake, since it's an easy typo to repeat.

### `||` picks the first truthy value, it isn't a fallback/try-this-then-that operator — 2026-09-07
Explained in the context of: `img.resize(fill().width(1200).height(600).gravity("faces" || "auto"))`
in [Home.js:19](src/pages/Home.js#L19), found during a full-project peer review.
Depth: covered that `"faces" || "auto"` always evaluates to `"faces"` because a non-empty string
is truthy — `||` short-circuits on the *first* truthy operand, it doesn't try `"faces"`, see if
Cloudinary likes it, and fall back to `"auto"` if not. That kind of runtime "try A, else B"
behavior doesn't exist via `||` for two string literals; both values are already known at
write-time, so one of them is simply dead. Distinguished this from the legitimate use of `||` for
defaults, e.g. `member.dietReq || ""`, where the left side is a *variable* that can actually be
falsy (`undefined`/`""`) at runtime.
Follow-ups the owner may want later: none critical — the code works today since `"faces"` was
presumably the intended value anyway; just drop the dead `|| "auto"` when touched next.

### Why automated tests, using the broken App.test.js as the example — 2026-09-07
Explained in the context of: [App.test.js](src/App.test.js), which still asserts the default CRA
"learn react" link exists (it doesn't, so the test currently fails), raised after the owner asked
"what would the benefit of having App.test.js be?" during a full-project peer review follow-up.
Depth: kept it short per the "explain-concept" skill's proportionality rule since it was a quick
question, not a deep-dive request. Core idea: a test records "this behavior must stay true" so a
future change that breaks it is caught automatically. Tied it directly to the `showSubmitButton`
bug fixed in this same session ([Rsvp.js:228](src/pages/Rsvp.js#L228)) as a concrete example of
something a one-line test would have caught instantly. Recommended either deleting the broken test
or replacing its assertion with something true today (e.g. Navbar renders an "RSVP" link), rather
than leaving a permanently-failing test in place.
Follow-ups the owner may want later: writing a couple of real tests around the RSVP page-navigation
booleans (`showNextButton`/`showSubmitButton`) and the tiered guest search
(`tier1Search`/`tier2Search`) would be the highest-value next tests for this app specifically.

### How React Testing Library "sees" the UI without a browser — 2026-09-07
Explained in the context of: a follow-up question on whether an automated test could have caught
the `showSubmitButton()` bug ([Rsvp.js:223](src/pages/Rsvp.js#L223)) fixed earlier this session —
owner's premise was that UI bugs are inherently something "automation wouldn't be able to catch."
Depth: explained that `@testing-library/react`'s `render` builds a real in-memory DOM tree via
`jsdom` (no browser, no pixels) from the same JSX the browser would receive, and `screen` queries
that tree for element presence (`queryByRole`, `toBeInTheDocument`). Reframed the bug as a
*conditional-rendering* fact ("does this element exist given this state") rather than a visual
one, and sketched the concrete assertion
(`expect(screen.queryByRole('button', {name: /submit/i})).not.toBeInTheDocument()`) that would
have failed before the fix and passed after. Explicitly drew the boundary: layout/visual concerns
(alignment, color, animation) are genuinely outside this tool's reach and need a human or a
heavier tool (e.g. Playwright screenshot diffing) — didn't overclaim that testing-library covers
everything.
Follow-ups the owner may want later: this pairs directly with the App.test.js follow-up above —
once that test is rewritten, extending it to assert on RSVP page-navigation state would be a
natural next exercise.

### What the exhaustive-deps lint rule actually tracks — 2026-09-07
Explained in the context of: [RsvpPage.js:103](src/reactComponents/RsvpPage.js#L103), after the
owner got (and correctly fixed) an ESLint "missing dependency" warning for `setName`,
`setSelectedGuest`, and `setPartyMembers`, then asked why other functions used in that same effect
(`setResults`, `setSessionState`, `loadExistingResponse`, `localStorage`, `process.env.NODE_ENV`)
weren't also called out.
Depth: covered the three buckets the rule sorts values into. (1) Values it can statically prove are
stable — a `useState`/`useReducer` setter destructured directly in the same component (`setResults`,
`setSessionState` here) — are silently exempted, no warning either way. (2) Values it can't prove
anything about — `setName`/`setSelectedGuest`/`setPartyMembers`, which arrive as `props.setName`
etc. rather than a local `useState` call, so the rule can't trace them back to Rsvp.js's `useState`
origin — get flagged conservatively even though they're actually stable in this app's case. (3)
Non-reactive values (globals like `localStorage`, build-time constants like `process.env.NODE_ENV`)
aren't tracked at all, since the rule only concerns itself with props/state/context-derived values
that can change between renders. This builds on the `invites`-in-useEffect conversation from
earlier today (same session) about when adding a missing dependency is safe vs. when it causes a
re-render loop.
Follow-ups the owner may want later: none pressing — this was a "why does the tool behave this way"
question rather than a bug, so no action item.
