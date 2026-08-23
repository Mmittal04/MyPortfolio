"""Select the most worth-reading articles from a batch of candidates,
before spending a full summarisation call on each one.

Without this step, "top N" just meant "first N encountered across feeds,"
which isn't a quality signal. This runs one extra Gemini call per topic per
run over all candidate titles/excerpts and asks the model to pick out the
top N, so a run with 50-60 new articles doesn't require reading through all
of them to find the handful worth including.
"""

import json
import sys

DEFAULT_MODEL = "gemini-2.5-flash-lite"

RANK_PROMPT_TEMPLATE = """You are curating a daily technology digest. Below is a \
numbered list of candidate article titles and short excerpts. Select the \
{top_n} most worth including.

Prioritise: genuine news significance, original reporting, and novelty.
Deprioritise: PR/announcement fluff, listicles, product-discount posts, \
and pieces that are mostly opinion with no new information.
If multiple candidates cover the same underlying event, keep only the best \
one of them.

Return ONLY a JSON array of the selected candidate numbers (integers), \
ordered from most to least worth reading, with at most {top_n} entries.

Candidates:
{candidates}
"""


def _format_candidates(entries):
    lines = []
    for i, entry in enumerate(entries):
        excerpt = (entry.get("raw_excerpt") or "").strip()
        # Strip is intentionally generous here; this is just enough context
        # for a relevance judgement, not the full article.
        excerpt = " ".join(excerpt.split())[:220]
        lines.append(f"{i}. {entry['title']} — {excerpt}")
    return "\n".join(lines)


def rank_articles(entries, top_n=10, dry_run=False, model=DEFAULT_MODEL, client=None):
    """Returns the subset of `entries` worth summarising, ranked and
    truncated to at most top_n. Falls back to a simple truncation (first
    top_n, unranked) if there's nothing to rank, dry_run is set, or the
    ranking call fails for any reason -- a ranking hiccup should never
    block the whole run.
    """
    if not entries:
        return []
    if len(entries) <= top_n:
        return entries
    if dry_run:
        return entries[:top_n]

    try:
        if client is None:
            from google import genai

            client = genai.Client()

        from google.genai import types

        prompt = RANK_PROMPT_TEMPLATE.format(top_n=top_n, candidates=_format_candidates(entries))
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={"type": "array", "items": {"type": "integer"}},
            ),
        )

        text = getattr(response, "text", None)
        if not text:
            raise RuntimeError("empty ranking response")

        indices = json.loads(text)
        selected = [entries[i] for i in indices if isinstance(i, int) and 0 <= i < len(entries)]
        if selected:
            return selected[:top_n]
        raise RuntimeError("ranking response contained no valid indices")

    except Exception as exc:  # noqa: BLE001 - ranking is a nice-to-have, never fatal
        print(f"  ! ranking failed, falling back to first {top_n} unranked: {exc}", file=sys.stderr)
        return entries[:top_n]
