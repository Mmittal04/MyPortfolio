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


def summarize_article(title, raw_excerpt, dry_run=False, model=DEFAULT_MODEL, client=None):
    if dry_run:
        return _dry_run_summary(title, raw_excerpt)

    if client is None:
        from google import genai

        client = genai.Client()  # reads GEMINI_API_KEY from the environment

    from google.genai import types

    prompt = PROMPT_TEMPLATE.format(title=title, excerpt=(raw_excerpt or "")[:2000])
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RESPONSE_SCHEMA,
        ),
    )

    try:
        return json.loads(response.text)
    except (json.JSONDecodeError, AttributeError, TypeError):
        # Malformed/empty response from one article shouldn't crash the
        # batch; fall back to storing whatever text came back with no
        # structured data.
        fallback_text = getattr(response, "text", None) or ""
        return {"summary": fallback_text[:500], "entities": [], "themes": []}
