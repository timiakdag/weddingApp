# Deployment

Two Firebase projects, aliased in `.firebaserc`:

| Alias  | Project ID         | URL                              |
|--------|--------------------|----------------------------------|
| `prod` | `weddingapp-3a077` | https://weddingapp-3a077.web.app |
| `test` | `weddingapp-test`  | https://weddingapp-test.web.app  |

`firebase.json` serves the `dist/` folder (Vite's build output) as a single-page app: every route
rewrites to `index.html`. That's what lets `react-router-dom` deep links and page refreshes work.

## Build before deploy

There's no CI connecting the build and deploy steps. `firebase deploy` uploads whatever is
currently in `dist/`, so always build first:

```
firebase use <prod|test>        # choose the target project
npm run lint                    # builds don't lint, so check first
npm run build                   # production build; reads .env + .env.production
# or, for the test project:
npm run build:test              # vite build --mode test; reads .env + .env.test
firebase deploy --only hosting
```

Vite bakes `VITE_*` values into the bundle at build time. The mode picks the env file
(`.env.<mode>`), and plain `.env` is always loaded. If you build with the wrong mode, the site
points at the wrong Firebase project, even though the deploy itself succeeds. A quick check: the
built `dist/assets/index-*.js` contains the `projectId`, which should match the alias you chose.

`npm run preview` serves the current `dist/` locally, which is useful for checking a build before
deploying. It's also the only local way to exercise the returning-guest restore, since
`npm run dev` clears `partyIdentifier` from `localStorage`.

## Migration history

The app moved from Create React App to Vite on 2026-11-22. Until it has been through a prod
deploy, an old CRA `build/` folder may still be on disk. Nothing deploys it any more, and it can
be deleted. Backups of the pre-migration `.env` files (`REACT_APP_` prefixes) are in `envBackup/`,
which is gitignored.

## Local caches

`.firebase/` holds the Firebase CLI's hosting cache. It's gitignored.

## Future: Android

An Android wrapper app would need its SHA-1 fingerprint registered in Firebase for Auth to work.
This isn't relevant unless that work starts.
