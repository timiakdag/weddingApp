# Deployment

Two Firebase projects, aliased in `.firebaserc`:

| Alias  | Project ID          | URL                                    |
|--------|---------------------|-----------------------------------------|
| `prod` | `weddingapp-3a077`  | https://weddingapp-3a077.web.app/       |
| `test` | `weddingapp-test`   | https://weddingapp-test.web.app         |

`firebase.json` serves the `build/` folder as a single-page app (all routes rewrite to
`index.html`, which is required for `react-router-dom` client-side routing to work on refresh/deep
link).

## The build-before-deploy gotcha

There is **no CI** wiring build → deploy together. The owner's own README notes this explicitly:
run `npm run build` before every `firebase deploy`, or the deployed site will be stale. Steps:

```
firebase use <prod|test>        # pick which project subsequent commands target
npm run build                   # regular build, reads .env / .env.production
# — or, for the test environment specifically —
npm run build:test              # runs `env-cmd -f .env.test react-scripts build`
firebase deploy --only hosting
```

## Android

If/when an Android wrapper app is added, it will need a SHA-1 fingerprint registered for Firebase
Auth to work correctly there (own note in README) — not relevant until that's actually pursued.
