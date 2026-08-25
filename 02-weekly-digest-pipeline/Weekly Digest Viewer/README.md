# Weekly Digest Viewer

Fetches the latest weekly digest per topic (Technology, Finance, Politics)
straight from the [MyPortfolio](https://github.com/Mmittal04/MyPortfolio)
repo's raw Markdown on GitHub — no server, no build step.

**`site/` is the real, finished website** — start there. Everything else in
this folder is either the data layer it's built on or reference material.

## Files

- **`site/`** — **the actual website.** `digest-data.js` wired into the
  "Weekly Digest Design System" component kit (from
  `Weekly Digest Design System.zip`, 26-08-26). Verified end-to-end in a
  real browser against live data: tab-switching, the Refresh button
  (force-bypasses the cache), and the double-click-to-open-feed
  interaction (confirmed by actually watching it pop open the right RSS
  feed in a new tab). Serve it with any static file server — it's plain
  HTML/JS/CSS, no build step. See `site/README` section below for the
  file-by-file breakdown.
- **`digest-data.js`** — the data layer `site/` is built on. Fetches,
  parses, and caches. Import as an ES module; no dependencies, no build
  step. `site/digest-data.js` is a copy of this file — if you change one,
  copy it to the other (see "Keeping site/ in sync" below).
- **`design-system/`** — the design kit, extracted from
  `Weekly Digest Design System.zip` for reference: component sources
  (`components/<group>/<Name>/{.jsx,.d.ts,.prompt.md}`), brand guidelines,
  design tokens. `site/` only needs the compiled `_ds_bundle.js` +
  `styles.css` + `tokens/*.css` from here (already copied over) — the rest
  is useful if a component's behavior ever needs to change, though there's
  no build tooling here to recompile `_ds_bundle.js` from edited `.jsx`
  sources; that needs Claude Design itself.
- **`index.html`** *(top level, superseded by `site/`)* — the original
  unstyled integration-test scaffold from before the design kit existed.
  Kept as a minimal reference for calling the data layer with zero design
  dependency; not the site to actually use.
- **`.claude/launch.json`** *(in the top-level `Portfolio/` folder, two
  levels up)* — local `python3 -m http.server` configs: `weekly-digest-site`
  (serves `site/`, port 8744) and `weekly-digest-viewer` (serves this
  whole folder, for the legacy `index.html`, port 8743). ES modules need a
  real HTTP origin; opening a file directly (`file://`) or as a `data:`
  URL won't work.

## Keeping `site/` in sync

`site/digest-data.js` is a plain copy of the top-level `digest-data.js`,
not a symlink. After editing the top-level file:

```bash
cp digest-data.js site/digest-data.js
```

## Using the data layer directly

```js
import { TOPICS, loadAllDigests } from './digest-data.js';

const digests = await loadAllDigests();
// digests.technology / digests.finance / digests.politics
// each is a DigestResult -- see the shape below
```

`TOPICS` is the tab list, in order: `[{slug: 'technology', name: 'Technology'}, ...]`.
Use `.slug` to look up `digests[slug]`, `.name` for the tab label.

Pass `{ force: true }` to skip the cache read (still writes the fresh
result back to cache afterward) — `site/`'s Refresh button uses this so it
does something within the 15-minute cache window instead of silently
returning the same cached result:

```js
await loadAllDigests({ force: true });
await loadDigest('technology', { force: true }); // per-topic form
```

### `DigestResult` shape

Every entry in `loadAllDigests()`'s return value (and what `loadDigest(slug)`
resolves to) looks like this. Render UI purely off `.status`:

```js
{
  status: 'ready' | 'empty' | 'error',
  topic: { slug: 'technology', name: 'Technology' },
  runDate: '2026-08-25' | null,   // the digest's run date
  articles: [{
    title: string,
    link: string,                 // original article URL
    summary: string,
    themes: string[],             // [] if the digest had none
    entities: string[],           // [] if the digest had none
    feedUrl: string | null,       // the RSS feed this article was pulled
                                   // from; null for digests from before
                                   // 25-08-26 (no **Feed:** line yet)
  }],
  error: { kind: string, message: string } | null,
}
```

- **`status: 'ready'`** — `articles.length > 0`, render them normally.
- **`status: 'empty'`** — fetched fine, zero new articles that week. Not an
  error — show something like "No new articles this week," not a failure
  state.
- **`status: 'error'`** — show `error.message`. `error.kind` lets the UI
  distinguish cases if useful:
  - `'not_found'` — nothing published for this topic yet (e.g. brand new
    topic, or its first run hasn't happened).
  - `'rate_limited'` — GitHub's unauthenticated API limit (60 req/hr per
    visitor IP) was hit. Message includes when it resets.
  - `'network'` — GitHub unreachable, or an unexpected HTTP status.

## How it works

1. Lists `02-weekly-digest-pipeline/digests/<slug>/` via the GitHub Contents
   API and picks the newest `.md` file by filename (`YYYY-MM-DD.md` sorts
   chronologically as a plain string sort).
2. Fetches that file's raw Markdown from `raw.githubusercontent.com`.
3. Parses it with a purpose-built parser (not a general Markdown library) —
   it only understands the exact template
   `02-weekly-digest-pipeline/src/digest.py` renders. **If that template's
   format changes, `parseDigestMarkdown()` needs to change with it.**
4. Caches each topic's result in `sessionStorage` for 15 minutes (keyed
   `weekly-digest-cache:v1:<slug>`) so repeated page loads / tab reopens
   within a session don't re-hit the GitHub API. Rate-limit and network
   errors are deliberately *not* cached, so a transient blip gets retried
   on the next load rather than being stuck for 15 minutes.

Both `api.github.com` and `raw.githubusercontent.com` send permissive CORS
headers, so this works from any static host (GitHub Pages, or anywhere
else) with no proxy needed.

`raw.githubusercontent.com` sits behind a CDN with a 5-minute
(`max-age=300`) edge cache — a push can take a few minutes to actually show
up there, even with a cache-busting query string (the CDN ignores it) or
`fetch(url, {cache: 'no-store'})` (that only bypasses the *browser's* cache,
not the CDN edge's). A non-issue for a weekly digest in practice; only
bites if you're testing minutes after pushing.

## `site/` architecture, and a Babel gotcha worth knowing

`site/index.html` loads React/ReactDOM/Babel-standalone/lucide from CDN,
then `_ds_bundle.js` (the compiled component kit), then renders
`DigestApp.jsx` (page shell: header, tabs, sidebar) which composes
`DigestPanel.jsx` (one topic's content, dispatching on `result.status`)
from the kit's `ArticleList`/`DigestMeta`/`EmptyState`/`ErrorNotice`/
`SkeletonArticle` components.

**The gotcha:** `digest-data.js` is loaded via a native
`<script type="module">` in `index.html`, which bridges its exports onto
`window.__digestData` — *not* imported directly from `DigestApp.jsx`.
`DigestApp.jsx`/`DigestPanel.jsx` load as `<script type="text/babel">`,
transpiled in-browser by Babel standalone. Calling `import('./digest-data.js')`
from *inside* a text/babel script fails with `ReferenceError: require is
not defined` — the in-browser Babel transformer rewrites dynamic `import()`
into a CommonJS `require()` call, which doesn't exist in a browser. Splitting
data-loading into its own native module script sidesteps it entirely.
`DigestApp.jsx`'s `waitForDigestData()` polls for `window.__digestData`
since module scripts (deferred) and text/babel scripts (transformed by a
UMD library scanning the document) don't have a guaranteed relative
execution order.

## Known limitation

The parser assumes article titles don't contain a literal `]` and links
don't contain a literal `)` — true of every real digest produced so far,
but a title or URL that did contain one would break that article's parse.
Worth revisiting if it ever actually happens; not worth the complexity of
a full Markdown parser up front for output this structured/predictable.
