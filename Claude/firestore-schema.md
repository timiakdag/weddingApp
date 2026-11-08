# Firestore Schema

The repo has no schema file. The field shapes below come from the read and write calls in
`src/pages/Rsvp.js` and `src/reactComponents/RsvpPage.js`. If a task depends on exact field
behavior, check the Firebase console. The security rules, however, are the deployed rules, not a
reconstruction.

## Security rules

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

**`invitations`** is read-only from the client, and client writes are always blocked. Guest data
is loaded from a trusted context (the import script in `csvFolder/`, which uses admin
credentials), never from the web app.

**`responses`** allows any client to create, update or read any document. There's no
`request.auth` check and no ownership rule. The consequences:

- Anyone who knows a `partyIdentifier` can read or overwrite that party's response.
- The whole collection can be listed.

This is an accepted tradeoff for a low-stakes RSVP site. `partyIdentifier` is a random UUID, so
guessing one isn't practical. Guaranteeing that only the submitting party can change its response
would need Firebase Auth or App Check plus stricter rules. An unguessable ID alone isn't enough.
Discuss before changing.

## `invitations` collection

One document per guest. The app loads the whole collection on the RSVP page with `getDocs` and
searches it client-side.

- `allowedGuests` (int)
- `fullName` (string)
- `guestId` (UUID): identifies an individual guest
- `lookupNames` (array of strings): normalized name variants for exact/substring search
- `partyIdentifier` (UUID): shared by every member of the same party
- `partyMembers` (array): party membership info
- `pages` (map): numbers associated with each form page. Not read by the current code.
- `searchText` (string): Fuse.js key for fuzzy matching on misspellings
- `searchTokens` (array): reserved for search scoring. Not used yet.

## `responses` collection

The app writes one document per party when a guest submits the form. **The document ID is the
`partyIdentifier`**, and the write uses `setDoc` (not `addDoc`), so a resubmission replaces the
existing document.

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

On a return visit, `loadExistingResponse` in `RsvpPage.js` reads the document back and fills in
`rsvpStatus`, `dietaryRequirements` and `songRequests`.

## Leftover snippet

There's a commented-out Firebase quickstart snippet at the bottom of `Rsvp.js` that references a
`users` collection. It's boilerplate, not part of the schema.
