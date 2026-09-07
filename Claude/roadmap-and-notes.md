# Roadmap, TODOs, and in-progress work

A running list pulled from the owner's own scattered notes plus what's visible in the repo, kept
in one place so it doesn't get lost across sessions. Update this file as items get done or new
ones come up — don't let it go stale.

## Open TODOs (owner's own notes, from `README.md`)

- ~~Align the RSVP Yes/No buttons so they line up regardless of how long each guest's name is.~~
  Done as of 2026-09-07 — `RsvpPage.js`'s party list now uses a `grid grid-cols-[1fr_auto]` layout
  (one `<Fragment key={member.guestId}>` per member contributing a name cell and a buttons cell)
  instead of one flex row per person, so button columns line up regardless of name length.
- Next/Prev buttons exist on every page but should render inactive-styled on the first and last
  page — confirm current behavior matches intent (`showPrevButton`/`showNextButton` in `Rsvp.js`
  currently just hide the button entirely rather than disabling it; worth checking whether that's
  what "inactive" was meant to mean).

## Open TODOs (`Reminders.txt`)

- Guest invite upload needs to support re-upload, i.e. adding/removing people from the
  `invitations` collection from a re-run of the upload rather than only ever appending.

## In-progress / unwired

- `src/pages/Gifts.js` exists but is completely empty, and has no route in `App.js` or link in
  `Navbar.js`. Likely the next page being started — check with the owner before assuming its
  intended shape.
- `react-hook-form`, `zod`, `@hookform/resolvers`, and Cloudinary (`@cloudinary/react`,
  `@cloudinary/url-gen`) are installed dependencies not yet used anywhere in `src/`. Possibly
  intended for a future rework of the RSVP form (validation) and for image hosting, respectively —
  confirm intent before introducing them into new code.
- `src/pages/LeafPage.js`, `src/reactComponents/LeafInput.js` (the unwired "Community Board"
  page), and `src/reactComponents/SignInForm.js`/`UserPanel.js` (the unused Firebase Auth UI) were
  deleted on 2026-09-07 as part of a peer review cleanup, along with the commented-out auth block
  in `Rsvp.js` that referenced them. They're no longer in the repo — if a community board or
  guest sign-in is wanted later, it'd be a fresh build rather than resuming this code.
- `csvFolder/` at the repo root contains a Python virtualenv — likely a one-off script for
  generating/importing the `invitations` CSV data into Firestore, separate from the React app
  itself.

## Not yet folded into these notes

- `updated_rsvp_implementation_plan.docx` (repo root) — a binary Word doc that can't be read
  directly by Claude. If it contains a plan that should inform current work, ask the owner to
  paste the relevant section into a message or into this file.
