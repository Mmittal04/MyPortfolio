# UI kit — Weekly Digest website

Recreation of the digest reader the `weekly-digest-viewer` data layer feeds. One surface;
the product is a single-page reader with three topic tabs.

| File | What it is |
| --- | --- |
| `index.html` | Interactive kit entry. Switch topics, refresh (fakes a load), toggle the empty and rate-limited states. |
| `DigestApp.jsx` | Masthead, intro, tabs, two-column body, sidebar, footer. |
| `DigestPanel.jsx` | One topic panel — renders purely off `result.status` (`ready` / `empty` / `error`). |
| `sample-data.js` | Stand-in for `loadAllDigests()`, same `DigestResult` shape. Illustrative content, not real digests. |

Wiring to the real data layer: replace `sample-data.js` with
`import { TOPICS, loadAllDigests } from './digest-data.js'` and drop the "Digest states"
sidebar block (demo-only controls).

Everything visual comes from the published components — this kit implements no primitives of its own.
