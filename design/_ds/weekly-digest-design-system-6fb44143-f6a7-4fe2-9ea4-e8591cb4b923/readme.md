# Maan's Weekly Digest — Design System

An automated pipeline reads the week's news across three topics, summarises each article, and
publishes a Markdown digest to GitHub. The **Weekly Digest website** is the reader for that output:
one page, three topic tabs, a dated list of summarised articles with their themes and entities.

This design system covers that website. It is a **from-scratch brand** — see "What the sources did
and didn't contain" below.

## Sources provided

| Source | What it is |
| --- | --- |
| `weekly-digest-viewer/` (mounted local folder) | The data layer only: `digest-data.js`, an unstyled `index.html` integration-test scaffold, and a README. Read in full. |
| `https://github.com/Mmittal04/MyPortfolio` | Referenced by the data layer as the digest source (`02-weekly-digest-pipeline/digests/<topic>/YYYY-MM-DD.md`). **Not accessible from this session** — no GitHub connection was available, so no real digest text was read. |

### What the sources did and didn't contain

- **Did:** the domain model — three topics (`technology`, `finance`, `politics`, in that order),
  the `DigestResult` shape (`status` / `runDate` / `articles[{title, link, summary, themes, entities}]` / `error{kind, message}`),
  and the three states every panel must render (`ready`, `empty`, `error` with kinds `not_found`, `rate_limited`, `network`).
- **Did not:** any styling, colours, fonts, logo, icons, imagery, or component definitions. The
  scaffold's `<body>` is explicitly marked "replace everything". The visual language here was
  authored to the brief (*warm, earthy, split-complementary; reader-friendly*), not extracted.

**No logo exists.** The wordmark is the brand name set in Literata — see `guidelines/wordmark.html`.
Nothing was drawn or invented as a mark.

---

## Content fundamentals

The product's voice is the voice of a careful reader summarising for another reader. Two registers:

**Editorial (article summaries, run headings).** Third person, past tense, declarative. No hedging
adverbs, no "notably" or "importantly". Facts and attributions carry the weight:

> Three major central banks left policy unchanged this week, citing a slower but still-uneven
> decline in core inflation. Guidance pointed to a first cut late in the year rather than at the
> next meeting.

**Interface (labels, states, empty and error copy).** Plain, short, second person only where the
reader is being addressed. Sentence case everywhere except small uppercase section labels
(`ENTITIES MENTIONED`, `RECURRING THEMES`), which are tracked at 0.09em.

Rules:

- **Never rewrite pipeline output.** Article titles, summaries, themes, entities and `error.message`
  render verbatim. Themes stay lowercase as the digest emits them.
- **An empty week is not an error.** "No new articles this week." — quiet, dashed border, no red.
  Never "Oops", never "Something went wrong".
- **Errors state the fact and the remedy.** "GitHub API rate limit hit, resets at 4:15:00 PM."
  No apology, no exclamation marks.
- **No emoji.** Anywhere. Not in labels, not in empty states, not in headings.
- **Dates** read long-form in prose ("August 25, 2026") and ISO in mono metadata ("2026-08-25").
- **Numbers** are plain: "4 articles", "01" for card indices.
- **Sentence case** for headings and buttons ("Read source", not "Read Source").
- Avoid marketing verbs — no "unlock", "supercharge", "curated". The site's own line is descriptive:
  "An automated pipeline reads the week's coverage across three topics."

---

## Visual foundations

**Palette — warm earthy split-complementary.** Clay (`#9E4A2E`, hue ≈ 18°) is the base. Its split
complements are teal (`#2E6B63`) and indigo (`#3C4E7A`). Every neutral is warm (Sand, a
paper-toned ramp from `#FCF9F4` to `#1C1913`) — no cool greys anywhere. Clay carries actions and
links; teal and indigo appear almost exclusively as topic accents. Each topic owns one hue:
Technology → indigo, Finance → teal, Politics → clay. Signal colours are limited to two: rust
(`#A33A2B`) for errors, amber (`#C2872B`) for the softer rate-limit notice.

**Type.** Literata for everything readable — a screen-reading serif with generous x-height, set at
16/1.65 for body and capped at a 66ch measure. Archivo (sans) for UI chrome, labels and buttons.
IBM Plex Mono for dates and card indices only. Scale is ten steps, 12 → 48px; display is 48/1.15 at
600 with -0.015em tracking. Nothing is set in all caps except 12px labels.

**Backgrounds.** Flat warm colour, always. Sand-100 for the page, near-white `#FFFDFA` for cards,
Sand-50 for the masthead and footer bands. No gradients, no photography, no illustration, no
texture, no full-bleed imagery — the brand has no image library and none is faked. Colour blocks
(the clay wordmark panel) are the only decorative fill.

**Layout.** 1120px page max, 24px gutters, a 720px reading column, and a fixed 232px sidebar on the
digest view. The sidebar is sticky; nothing else is fixed. Vertical rhythm comes off a 4px scale
(4 → 96px); cards stack at 16px, sections separate at 40px.

**Cards.** Warm off-white, 8px radius, a 1px hairline border at 8% ink, and a soft two-layer shadow
(`0 1px 2px` + `0 2px 8px`, both warm-tinted). A **coloured 3px left edge is used in exactly one
place** — encoding an article's topic. That is a data channel, not decoration; do not add accent
borders elsewhere.

**Borders and rules.** Hairlines everywhere: 1px `--border-subtle` for dividers and tab rails,
dashed `--border-strong` only for the empty state.

**Shadows.** Four steps: hairline ring, card, raised (hover), overlay (modals, unused so far). No
inner shadows except an optional 1px top highlight on inverse surfaces. Nothing glows.

**Corner radii.** 2px (swatches, mono chips), 4px (buttons, inputs), 8px (cards), 12px (large
panels), 20px (rare), pill (tags only).

**Motion.** Short and flat. 120ms colour transitions, 180ms card lifts, 260ms panel fades, 400ms tab
crossfades, all on `cubic-bezier(.2,.8,.3,1)`. The one looping animation is the skeleton shimmer at
1.4s. No bounce, no spring, no scaling, no spinners.

**Hover.** Buttons darken one step (clay-600 → clay-700); cards raise their shadow and lift 1px;
tabs move from muted to primary text; ghost buttons pick up a clay-100 wash. **Press:** darken
another step and `translateY(1px)` — never scale down. **Focus:** 2px indigo outline at 2px offset,
or the `--ring-focus` halo on filled controls.

**Transparency and blur.** Almost none. Alpha is used only for hairline borders and shadow colour.
No frosted glass, no backdrop blur, no protection gradients — text always sits on flat colour with
real contrast, so no scrims are needed.

**Imagery.** None. If imagery is ever added, it should be warm-toned and quiet; anything cool or
high-saturation will fight the palette.

---

## Iconography

The codebase ships **no icons, no icon font, no SVG assets, and no images** — it is a 272-line data
module and an unstyled test page. Nothing existed to copy in, so `assets/` holds no marks.

**Substitution (please confirm):** [Lucide](https://lucide.dev) 0.446.0 from CDN, 16px at 1.5–2px
stroke, `currentColor`. It matches the brand's thin-hairline, unfilled character. Used sparingly —
refresh, external-link, github — never decoratively, never inside body copy.

```html
<script src="https://unpkg.com/lucide@0.446.0/dist/umd/lucide.min.js"></script>
<i data-lucide="rotate-cw"></i>
<script>lucide.createIcons()</script>
```

- **Emoji: never used.**
- **Unicode as glyphs:** only the middot (`·`) as the separator in entity runs and mono metadata.
- Icons never appear alone as a label — `IconButton` always carries an accessible `label`.

---

## Font substitution — needs your input

No font binaries were supplied. **Literata** (body/display) and **Archivo** (UI), plus **IBM Plex
Mono** for metadata, are loaded from Google Fonts in `tokens/fonts.css`. If the brand has real
licensed faces, send the files and I'll swap them into local `@font-face` rules.

---

## Index

**Root**

- `styles.css` — the single entry point consumers link. `@import` lines only.
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent-Skills wrapper for using this system outside the design tool.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`, `base.css`.
- `guidelines/` — 16 specimen cards (Colors, Type, Spacing, Brand).
- `assets/` — empty by design; no logo or icon assets existed to import.

**Components** (`window.WeeklyDigestDesignSystem_6fb441.<Name>`)

| Group | Components |
| --- | --- |
| `components/core/` | `Button`, `IconButton`, `Tag`, `Badge`, `Card`, `Divider` |
| `components/navigation/` | `SiteHeader`, `TopicTabs` |
| `components/content/` | `DigestMeta`, `ArticleCard`, `ArticleList` |
| `components/feedback/` | `EmptyState`, `ErrorNotice`, `SkeletonArticle` |

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when + example).

**UI kits**

- `ui_kits/website/` — the digest reader. Interactive: topic switching, fake refresh, empty and
  rate-limited states. See its README for wiring to the real data layer.

### Intentional additions

No source defined a component inventory, so this set was authored from the product's actual needs.
Every component maps to something the reader renders: `ArticleCard`/`ArticleList` to
`DigestResult.articles`, `DigestMeta` to `topic.name` + `runDate`, `TopicTabs` to `TOPICS`, and
`EmptyState`/`ErrorNotice`/`SkeletonArticle` to the three `status` values plus loading. Nothing
speculative (no Modal, Toast, Avatar, Table) was added.
