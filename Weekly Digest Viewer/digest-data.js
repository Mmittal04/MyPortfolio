/**
 * Data layer for the Weekly Digest viewer.
 *
 * Fetches the latest weekly digest per topic straight from the MyPortfolio
 * GitHub repo (raw Markdown, no server), parses it into structured JSON, and
 * caches it in sessionStorage for a few minutes to stay well under GitHub's
 * unauthenticated API rate limit (60 requests/hour per visitor IP).
 *
 * This file is the data layer only -- it has no opinions about layout,
 * styling, or how tabs switch. Call loadAllDigests() once, then render
 * whatever `.status` each topic came back with. See the DigestResult shape
 * documented above loadDigest() below.
 *
 * Usage:
 *   import { TOPICS, loadAllDigests } from './digest-data.js';
 *   const digests = await loadAllDigests();
 *   // digests.technology / digests.finance / digests.politics
 */

// ---------------------------------------------------------------------------
// Config -- change these if the repo, branch, or digest path ever moves.
// ---------------------------------------------------------------------------

const GITHUB_OWNER = 'Mmittal04';
const GITHUB_REPO = 'MyPortfolio';
const GITHUB_BRANCH = 'main';
const DIGESTS_BASE_PATH = '02-weekly-digest-pipeline/digests';

/** One entry per topic, in the order they should appear as tabs. Slugs must
 * match the `slug:` values in the pipeline's config/topics.yaml exactly --
 * that's also the digests/<slug>/ folder name in the repo. */
export const TOPICS = [
  { slug: 'technology', name: 'Technology' },
  { slug: 'finance', name: 'Finance' },
  { slug: 'politics', name: 'Politics' },
];

const CACHE_PREFIX = 'weekly-digest-cache:v1:';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// GitHub fetching
// ---------------------------------------------------------------------------

/**
 * Lists digests/<slug>/ via the GitHub Contents API and returns the most
 * recent .md file's metadata (filenames are YYYY-MM-DD.md, so a plain
 * lexicographic sort is also a chronological sort).
 *
 * Throws a DigestError with `.kind` set to 'not_found', 'rate_limited', or
 * 'network' -- callers should catch and turn this into UI state, not let it
 * propagate as an unhandled rejection.
 */
async function fetchLatestDigestMeta(slug) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DIGESTS_BASE_PATH}/${slug}?ref=${GITHUB_BRANCH}`;

  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  } catch (networkErr) {
    throw new DigestError('network', `Could not reach GitHub: ${networkErr.message}`);
  }

  if (response.status === 404) {
    throw new DigestError('not_found', `No digests found yet for "${slug}".`);
  }
  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    const resetAt = new Date(Number(response.headers.get('x-ratelimit-reset')) * 1000);
    throw new DigestError(
      'rate_limited',
      `GitHub API rate limit hit, resets at ${resetAt.toLocaleTimeString()}.`
    );
  }
  if (!response.ok) {
    throw new DigestError('network', `GitHub API returned ${response.status} for "${slug}".`);
  }

  const listing = await response.json();
  const mdFiles = listing
    .filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
    .sort((a, b) => (a.name < b.name ? 1 : -1)); // descending -> newest first

  if (mdFiles.length === 0) {
    throw new DigestError('not_found', `Digest folder for "${slug}" exists but has no files yet.`);
  }

  return mdFiles[0]; // { name, download_url, ... }
}

/** Fetches raw Markdown text from a GitHub `download_url`. */
async function fetchRawMarkdown(downloadUrl) {
  let response;
  try {
    response = await fetch(downloadUrl);
  } catch (networkErr) {
    throw new DigestError('network', `Could not fetch digest content: ${networkErr.message}`);
  }
  if (!response.ok) {
    throw new DigestError('network', `Fetching digest content returned ${response.status}.`);
  }
  return response.text();
}

// ---------------------------------------------------------------------------
// Markdown parsing
//
// Not a general-purpose Markdown parser -- this only understands the exact
// template digest.py renders (see 02-weekly-digest-pipeline/src/digest.py).
// If that template's format ever changes, this parser needs to change with
// it. Known assumption: article titles don't contain literal "]" and links
// don't contain literal ")" -- true of every real digest so far.
// ---------------------------------------------------------------------------

const HEADER_RE = /^#\s+(.+?)\s+—\s+\S+\s+Digest\s+—\s+(\d{4}-\d{2}-\d{2})/;
// The **Feed:** line is a newer addition to the template (25-08-26) -- kept
// optional here so digests generated before that change still parse fine,
// just with feedUrl coming back null instead of breaking the whole match.
const ARTICLE_RE =
  /##\s*\[(.+?)\]\((.+?)\)\s*\n+([\s\S]*?)\n+\*\*Themes:\*\*\s*(.+?)\s*\n\*\*Entities:\*\*\s*(.+?)\s*(?:\n\*\*Feed:\*\*\s*(.+?)\s*)?(?:\n|$)/g;
const EMPTY_MARKER = '—'; // em dash: digest.py's placeholder for "no themes"/"no entities"/"no feed"
const NO_ARTICLES_MARKER = 'No new articles for this topic';

/**
 * Parses one digest Markdown file into structured data.
 * @param {string} markdown
 * @returns {{ topicName: string|null, runDate: string|null, articles: Array }}
 */
export function parseDigestMarkdown(markdown) {
  const headerMatch = markdown.match(HEADER_RE);
  const topicName = headerMatch ? headerMatch[1].trim() : null;
  const runDate = headerMatch ? headerMatch[2] : null;

  if (markdown.includes(NO_ARTICLES_MARKER)) {
    return { topicName, runDate, articles: [] };
  }

  const articles = [];
  // Reset lastIndex since ARTICLE_RE is a module-level `g` regex reused
  // across calls -- otherwise a previous parse's position would leak in.
  ARTICLE_RE.lastIndex = 0;
  let match;
  while ((match = ARTICLE_RE.exec(markdown)) !== null) {
    const [, title, link, summary, themesRaw, entitiesRaw, feedRaw] = match;
    articles.push({
      title: title.trim(),
      link: link.trim(),
      summary: summary.trim(),
      themes: splitList(themesRaw),
      entities: splitList(entitiesRaw),
      feedUrl: splitValue(feedRaw),
    });
  }
  return { topicName, runDate, articles };
}

function splitList(raw) {
  const trimmed = raw.trim();
  if (trimmed === EMPTY_MARKER || trimmed === '') return [];
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
}

/** Like splitList but for a single-value field (the Feed URL): returns null
 * instead of an empty array when there's nothing there. */
function splitValue(raw) {
  if (raw === undefined) return null; // no **Feed:** line at all (older digest)
  const trimmed = raw.trim();
  return trimmed === EMPTY_MARKER || trimmed === '' ? null : trimmed;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class DigestError extends Error {
  /** @param {'not_found'|'rate_limited'|'network'|'parse_error'} kind */
  constructor(kind, message) {
    super(message);
    this.name = 'DigestError';
    this.kind = kind;
  }
}

// ---------------------------------------------------------------------------
// Cache (sessionStorage)
// ---------------------------------------------------------------------------

function readCache(slug) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + slug);
    if (!raw) return null;
    const { cachedAt, payload } = JSON.parse(raw);
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return payload;
  } catch {
    return null; // corrupt cache entry or sessionStorage unavailable -- just refetch
  }
}

function writeCache(slug, payload) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + slug, JSON.stringify({ cachedAt: Date.now(), payload }));
  } catch {
    // sessionStorage full or unavailable (e.g. private browsing) -- caching
    // is an optimization, not a requirement, so just skip it silently.
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * DigestResult -- the shape every entry in loadAllDigests()'s return value
 * has, and what loadDigest() resolves to. Render UI purely off `.status`:
 *
 *   status: 'ready'   -> articles.length > 0, show them
 *   status: 'empty'   -> fetched fine, zero articles this week (not an error)
 *   status: 'error'   -> show `.error.message`; `.error.kind` lets you
 *                        distinguish "nothing published yet" (not_found)
 *                        from "try again shortly" (rate_limited/network)
 *
 * {
 *   status: 'ready' | 'empty' | 'error',
 *   topic: { slug: string, name: string },
 *   runDate: string | null,       // 'YYYY-MM-DD', the date this digest ran
 *   articles: [{
 *     title: string,
 *     link: string,
 *     summary: string,
 *     themes: string[],           // [] if the digest had none
 *     entities: string[],         // [] if the digest had none
 *     feedUrl: string | null,     // the RSS feed this article came from;
 *                                 // null for digests from before 25-08-26
 *                                 // (no **Feed:** line to parse)
 *   }],
 *   error: { kind: string, message: string } | null,
 * }
 */

/** Loads and parses the latest digest for one topic slug. Never throws --
 * failures come back as a DigestResult with status 'error'.
 * @param {{ force?: boolean }} [options] - force: true skips the cache read
 * (a manual "Refresh" action should feel like it does something, not
 * silently return the same cached result for up to 15 minutes). The
 * result is still written back to cache afterward either way. */
export async function loadDigest(slug, { force = false } = {}) {
  const topic = TOPICS.find((t) => t.slug === slug) ?? { slug, name: slug };

  const cached = force ? null : readCache(slug);
  if (cached) return cached;

  let result;
  try {
    const meta = await fetchLatestDigestMeta(slug);
    const markdown = await fetchRawMarkdown(meta.download_url);
    const parsed = parseDigestMarkdown(markdown);
    result = {
      status: parsed.articles.length > 0 ? 'ready' : 'empty',
      topic,
      runDate: parsed.runDate,
      articles: parsed.articles,
      error: null,
    };
  } catch (err) {
    const digestErr =
      err instanceof DigestError ? err : new DigestError('network', err.message || String(err));
    result = {
      status: 'error',
      topic,
      runDate: null,
      articles: [],
      error: { kind: digestErr.kind, message: digestErr.message },
    };
  }

  // Cache successes and "not found" alike (both are cheap to keep for a
  // while) but not rate-limit/network errors, so a transient blip gets
  // retried on the next load rather than being stuck in cache for 15 min.
  if (result.status !== 'error' || result.error.kind === 'not_found') {
    writeCache(slug, result);
  }
  return result;
}

/** Loads all topics in parallel. Returns an object keyed by topic slug,
 * e.g. { technology: DigestResult, finance: DigestResult, politics: DigestResult }
 * @param {{ force?: boolean }} [options] - see loadDigest() */
export async function loadAllDigests(options) {
  const results = await Promise.all(TOPICS.map((t) => loadDigest(t.slug, options)));
  return Object.fromEntries(TOPICS.map((t, i) => [t.slug, results[i]]));
}
