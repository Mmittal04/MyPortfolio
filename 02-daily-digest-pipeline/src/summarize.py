"""Turn one article into a structured summary via a single Gemini API call.

Returns a dict with keys: summary (str), entities (list of {text, type}),
themes (list of str). Uses Gemini's structured-output mode (response_schema)
so the model is constrained to return matching JSON directly, rather than
running a separate NER library or hoping a plain-text instruction is obeyed.

Free tier: no billing required, key from aistudio.google.com/apikey. Default
model is gemini-2.5-flash-lite for its higher daily request quota, since this
pipeline may run against up to three topics a day.
"""

import json
import time

DEFAULT_MODEL = "gemini-2.5-flash-lite"

PROMPT_TEMPLATE = """You are helping build a daily news digest. Given the article \
title and excerpt below, write:

- a neutral, factual 2-3 sentence summary
- named entities mentioned (people, organisations, locations, or laws), each \
tagged as PERSON, ORG, LOC, LAW, or OTHER
- 1-4 short lowercase-hyphenated theme tags capturing the key topics

Title: {title}

Excerpt: {excerpt}
"""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "entities": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "type": {"type": "string", "enum": ["PERSON", "ORG", "LOC", "LAW", "OTHER"]},
                },
                "required": ["text", "type"],
            },
        },
        "themes": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["summary", "entities", "themes"],
}


def _dry_run_summary(title, raw_excerpt):
    """Deterministic stand-in used for local testing without an API key."""
    return {
        "summary": f"[DRY RUN] Placeholder summary for: {title}",
        "entities": [{"text": "Example Entity", "type": "ORG"}],
        "themes": ["placeholder-theme"],
    }


def summarize_article(title, raw_excerpt, dry_run=False, model=DEFAULT_MODEL, client=None, max_attempts=2):
    if dry_run:
        return _dry_run_summary(title, raw_excerpt)

    if client is None:
        from google import genai

        client = genai.Client()  # reads GEMINI_API_KEY from the environment

    from google.genai import types

    prompt = PROMPT_TEMPLATE.format(title=title, excerpt=(raw_excerpt or "")[:2000])
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=RESPONSE_SCHEMA,
    )

    last_failure = None
    for attempt in range(1, max_attempts + 1):
        response = client.models.generate_content(model=model, contents=prompt, config=config)

        # A blocked prompt is reported via prompt_feedback rather than an
        # exception, and won't succeed on retry, so fail immediately with
        # the real reason instead of masking it as an empty summary.
        block_reason = getattr(getattr(response, "prompt_feedback", None), "block_reason", None)
        if block_reason:
            raise RuntimeError(f"Gemini blocked the prompt for {title!r}: {block_reason}")

        text = getattr(response, "text", None)
        if text:
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                # Valid response, but not valid JSON; store the raw text
                # rather than losing it, with no structured data.
                return {"summary": text[:500], "entities": [], "themes": []}

        # No block reason and no text: a known free-tier quirk where the
        # API returns a genuinely empty response. Often clears on retry.
        candidates = getattr(response, "candidates", None) or []
        finish_reason = getattr(candidates[0], "finish_reason", None) if candidates else None
        last_failure = finish_reason
        if attempt < max_attempts:
            time.sleep(2)

    raise RuntimeError(
        f"Gemini returned an empty response for {title!r} after {max_attempts} attempt(s) "
        f"(finish_reason={last_failure})"
    )
