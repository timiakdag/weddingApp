# Deployment

Two Firebase projects, aliased in `.firebaserc`:

| Alias  | Project ID         | URL                              |
|--------|--------------------|----------------------------------|
| `prod` | `weddingapp-3a077` | https://weddingapp-3a077.web.app |
| `test` | `weddingapp-test`  | https://weddingapp-test.web.app  |

`firebase.json` serves the `build/` folder as a single-page app: every route rewrites to
`index.html`. That's what lets `react-router-dom` deep links and page refreshes work.

## Build before deploy

There's no CI connecting the build and deploy steps. `firebase deploy` uploads whatever is
currently in `build/`, so always build first:

```
firebase use <prod|test>        # choose the target project
npm run build                   # production build; reads .env / .env.production
# or, for the test project:
npm run build:test              # env-cmd -f .env.test react-scripts build
firebase deploy --only hosting
```

CRA bakes `REACT_APP_*` values into the bundle at build time. If you build with the wrong env
file, the site will point at the wrong Firebase project or Cloudinary account, even though the
deploy itself succeeds.

## Local caches

`.firebase/` holds the Firebase CLI's hosting cache. It's gitignored.

## Future: Android

An Android wrapper app would need its SHA-1 fingerprint registered in Firebase for Auth to work.
This isn't relevant unless that work starts.
