# Daily Digest Pipeline

Ingests new articles from RSS feeds for one or more topics, summarises each
one with the Gemini API (free tier) into a structured record (summary, named
entities, themes), stores it in SQLite, and writes a Markdown digest per
topic per day. A GitHub Actions workflow runs it on a daily cron schedule
and commits the results back to the repo.

**Cost:** this runs entirely on Gemini's free tier (no billing required).
Default model is `gemini-2.5-flash-lite`, chosen for its higher daily quota
(around 1,000 requests/day at last check), comfortably enough for the
current single-topic, 10-article-per-run setup. Free tier note: Google may
use free-tier prompts/responses to improve their products, worth knowing
given the topics here include public news content, not personal data. Rate
limits shift over time, so worth a quick check at
[ai.google.dev](https://ai.google.dev/gemini-api/docs/rate-limits) if runs
start failing.

Currently: **Technology only**, capped at the top 10 new articles per run.
Gender-affirming care/transgender rights and Energy & Climate were removed
from `config/topics.yaml` (23-08-26) to be rebuilt later with a proper
feed-list review, rather than left in half-configured. The Technology feed
list itself was reviewed against real sampled output on the same date: see
the comments in `config/topics.yaml` for what was dropped and why.

## Structure

```
config/topics.yaml     topic definitions: feeds, keyword filters, active flag
src/ingest.py          fetches + dedupes new articles per topic
src/rank.py            one Gemini call to pick the top N candidates before summarising
src/summarize.py       one structured Gemini API call per selected article
src/store.py           SQLite schema and read/write helpers
src/digest.py          renders the day's articles into Markdown
src/main.py            orchestrator (the entry point)
data/digest.db         SQLite database (created on first run)
digests/<slug>/<date>.md   daily output per topic
.github/workflows/daily-digest.yml   cron schedule + commit-back
```

## Ranking

Before this existed, "top 10" meant the first 10 articles encountered
across feeds in listing order, not a quality signal. Now every run pools
all pending candidates (new entries plus anything left over from previous
runs, capped at 60) and makes one Gemini call asking it to pick the top N
worth reading, prioritising genuine news significance and original
reporting over PR/announcement posts, listicles, and near-duplicate
coverage of the same event. Only the selected ones get a full
summarisation call; everything else is marked `rejected` in the database
so it's never re-considered or shown, rather than sitting in an endless
retry queue. If ranking itself fails for any reason, it falls back to the
first N candidates unranked rather than blocking the run.

Each article's status in the `articles` table is one of `pending` (seen,
not yet judged), `summarized` (selected and summarised, shown in the
digest), `failed` (selected, but summarisation genuinely errored out --
retry-eligible, competes in ranking again next run), or `rejected`
(ranked out, or a `failed` article that exhausted its retries; never
shown or reconsidered again). A ranking rejection and a summarisation
failure are deliberately kept separate: the former means the model judged
it not worth including, the latter means it never got a fair shot, so
only the latter gets retried, capped at `store.MAX_RETRIES` (3) attempts
before it's given up on as `rejected` too.

## Local setup

```bash
pip install -r requirements.txt

# Add your key to .env in the project root (already gitignored, never
# committed): GEMINI_API_KEY=... — see "Getting a Gemini API key" below.
# main.py loads it automatically via python-dotenv.

# Dry run: exercises ingestion, storage and digest rendering with
# placeholder summaries, no API key or cost required
python src/main.py --dry-run

# Real run against Technology only
python src/main.py --topics technology
```

Output lands in `digests/technology/<YYYY-MM-DD>.md` and `data/digest.db`.

## Getting a Gemini API key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   and sign in with a Google account.
2. If this is your first time in AI Studio, accept the terms of service.
   It automatically creates a default project and API key for you, no
   further setup needed, skip to step 5. If you already have a Google Cloud
   account, AI Studio won't auto-create a project; continue to step 3.
3. Click **Dashboard** in the left panel, then **Projects**, then **Import
   projects**, and select the Google Cloud project to use. (Any project
   works; it doesn't need a billing account attached for the free tier.)
4. Go to the **API Keys** page and click **Create API key**.
5. Copy the key immediately, it's shown once. Paste it somewhere safe, a
   password manager or a local `.env` file, not into any file that gets
   committed to the repo.

No card or billing setup is required for free-tier use. As of the time of
writing, new keys are created as "auth keys" by default, the current,
more secure key type. If you ever see an older key of yours labelled
"Standard" in the API Keys page, it's worth replacing it: Google is phasing
out standard keys, and requests using them stop working from September
2026.

## Using the key

**Locally:** put it in `.env` in the project root:

```
GEMINI_API_KEY=your-key-here
```

This file already exists as a gitignored template (see `.gitignore`), so it
never gets committed, just fill in the real value. `main.py` loads it
automatically on startup via `python-dotenv`; no need to `export` it by
hand or pass it in code.

**In GitHub Actions:** never put the key directly in a file, in code, or
in the workflow YAML. Instead:

1. Push this project to a GitHub repo.
2. In the repo, go to Settings → Secrets and variables → Actions → New
   repository secret.
3. Name it `GEMINI_API_KEY` and paste the key value in, then save.
4. The workflow at `.github/workflows/daily-digest.yml` already references
   `secrets.GEMINI_API_KEY`; GitHub injects it as an environment variable
   for that one step only, it's never written to logs or exposed in the
   repo itself.
5. The workflow runs every day at 12:00 UTC and can also be triggered
   manually from the Actions tab. It installs dependencies, runs
   `src/main.py` (all active topics), then commits any new digest files
   and the updated database back to the repo.

**If the key ever leaks** (accidentally committed, pasted somewhere public,
etc.): generate a new one in AI Studio, update the GitHub secret and any
local `.env` file to use it, then delete the old key from AI Studio's API
Keys page.

## Adding topics back

Each topic is a plain entry in `config/topics.yaml`: a slug, display name,
a feed list, an optional keyword filter, and an `active` flag. Adding
Gender-Affirming Care & Transgender Rights and Energy & Climate back means
adding a new entry to the file, not touching the pipeline code, same as
adding any other topic.

Worth reviewing the feed list carefully before the trans rights/
gender-affirming care topic goes live, since source spread matters more
there than for a general technology topic: aim for a mix of mainstream/
wire and specialist health-policy/legal-tracking outlets rather than a
single advocacy angle, ideally sampling real output first the way the
Technology feed list was reviewed (see `config/topics.yaml` comments).

## Known limitations / next steps

- `data/digest.db` is committed straight to the repo for simplicity. Fine
  at this scale; if the DB grows large, moving it out of git (e.g. an
  Actions artifact or external volume) would be the next step.
- Each article's Gemini call retries once if the API returns a genuinely
  empty response (a known free-tier quirk, no error, just no text), then
  gives up and logs the real reason (blocked prompt, empty response with
  its `finish_reason`, etc.) to stderr rather than silently storing a blank
  summary. If a batch shows empty summaries across the board, check the
  Actions run log for these `! summarisation failed for ...` lines first.
- `--max-articles` sets N for ranking (default 10): the number of articles
  `rank.py` selects out of the pending pool each run, see "Ranking" above.
  Rejected candidates are marked as such immediately rather than retried,
  so a large backlog clears in one run rather than trickling through over
  several days.
- This repo's existing `data/digest.db` had 82 rows from a run before the
  ranking step, the `failed` status, and the improved error surfacing all
  existed, 20 of them recorded as `(summarisation failed)` with no real
  reason captured and no way to distinguish them from a real success. The
  schema migration in `store.py` (runs on every connection, so this
  applies automatically) reclassifies any row matching that placeholder
  text from `summarized` to `failed`, making them retry-eligible again --
  it can't recover the original error, but the next attempt's stored text
  will include the actual exception rather than a generic placeholder.
- No retry/backoff on rate-limit errors (HTTP 429) specifically yet; a
  request that gets rate-limited currently falls back to the generic
  placeholder-on-failure path rather than waiting and retrying. Less of a
  concern now at one topic and a 10-article cap, worth revisiting if more
  topics come back online.
