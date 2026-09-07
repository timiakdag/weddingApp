# Firestore Schema (as observed in code)

There is no schema file in the repo — field shapes below are reverse-engineered from the
read/write calls in `src/pages/Rsvp.js` and `src/reactComponents/RsvpPage.js`. Treat them as
"believed accurate as of the last time these files were read," not a guarantee — verify against
the Firebase console if a task depends on exact field behavior. Security rules (below), however,
are the actual rules as confirmed by the owner on 2026-09-05.

## Security rules (confirmed, not inferred)

```
match /invitations/{docId} {
  allow read: if true;
  allow write: if false;
}

match /responses/{document} {
  allow create: if true;
  allow update: if true;
  allow read: if true;
  allow delete: if false;
}
```

- `invitations` is read-only from the client, writes always blocked — safe as long as guest
  invites are only ever written from a trusted context (e.g. the `csvFolder` import script using
  admin credentials, not the web app).
- `responses` allows **any client to create, update, or read any document**, with no ownership
  check — there's no `request.auth` gate and no rule tying a write to the caller having proven
  they are that party. In practice this means: anyone who has (or guesses) a `partyIdentifier` can
  read or overwrite another party's RSVP, dietary requirements, or song requests, and anyone can
  enumerate the whole `responses` collection. For a low-stakes wedding RSVP site this may be an
  acceptable tradeoff — `partyIdentifier` is a UUID, not a guessable sequential ID, so this isn't
  trivially exploitable by a stranger — but it's worth being a deliberate choice rather than an
  accidental one, since it's different from "only the guest who submitted this response can change
  it." If that stronger guarantee is ever wanted, it needs either Firebase Auth (currently unused,
  see `architecture.md`) or App Check plus tighter rules, not just a UUID being hard to guess.

## `invitations` collection

Read-only from the app (loaded in full on RSVP page mount via `getDocs`, then searched
client-side). One document per guest. Fields, per the doc-comment at the top of `Rsvp.js`:

- `allowedGuests` (int)
- `fullName` (string)
- `guestId` (UUID) — primary identifier for an individual guest
- `lookupNames` (array of strings) — normalized name variants used for exact/substring search
- `partyIdentifier` (UUID) — shared across every member of the same party/household
- `partyMembers` (array) — party membership info
- `pages` (dict) — numbers associated with each page (purpose not fully clear from current code;
  ask the owner before relying on this)
- `searchText` (string) — used as a Fuse.js search key for fuzzy matching on misspellings
- `searchTokens` (array) — present in the schema comment but noted as "not used yet"

## `responses` collection

Written by the app when a guest submits the RSVP form. **Document ID is the `partyIdentifier`**,
so a party can only ever have one response document — resubmitting overwrites it via `setDoc`
(not `addDoc`), it does not create duplicates or merge.

```
{
  updatedAt: serverTimestamp(),
  partyIdentifier: string,
  selectedGuest: { guestId: string, fullName: string },
  partyMembers: [{ guestId: string, fullName: string }, ...],
  rsvpStatus: { [guestId]: "yes" | "no" | null },
  dietaryRequirements: { [guestId]: string },
  songRequests: {
    yes: [{ artist: string, title: string }, ...],
    no:  [{ artist: string, title: string }, ...],
  },
}
```

## `users` collection

Referenced only inside a commented-out Firebase quickstart snippet at the bottom of `Rsvp.js`
(`addDoc(collection(db, "users"), {...})`). This is leftover boilerplate, not an active part of
the app — don't treat it as real schema.
