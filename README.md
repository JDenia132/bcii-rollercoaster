# The BCII Rollercoaster (iteration 3)

Merges iteration 1 (BCII method finder) and iteration 2 (BCII Rollercoaster), with user-testing feedback applied:

- No Canvas links. Every method opens in the tool with: when to use it, step-by-step how to do it, why it helps, and which methods come before and after it.
- "New to the double diamond?" explainer, shown automatically on first visit.
- Rollercoaster metaphor: Discover = the climb, Define = the first drop, Develop = the loops, Deliver = the home stretch.
- Assistant asks for symptoms (pick from a list) instead of requiring the root cause, and can tell a team to roll back a stage.
- Assistant is positioned for mid-project use; early-stage users are pointed to browsing Discover.

## Redeploy to the existing Vercel project (keeps the same URL and API key)

```
cd bcii-method-finder
npx vercel login
npx vercel link        # choose your existing bcii-method-finder project
npx vercel --prod
```

The ANTHROPIC_API_KEY environment variable is already saved on the project, so nothing else is needed.

## Run locally

```
npm install
cp .env.example .env.local   # paste your key
npm run dev
```

## Editing methods

All method content lives in `lib/methods.js`. Wording is written from general knowledge of each method, so check it against the course material and adjust where BCII teaches it differently.
