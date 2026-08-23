"""Orchestrator: for each active topic, ingest new articles, summarise them,
store the results, and write today's Markdown digest.

Usage:
    python src/main.py                          # run all active topics
    python src/main.py --topics technology       # run just one topic
    python src/main.py --dry-run                 # skip real LLM calls
    python src/main.py --max-articles 10          # cap per-topic batch size
"""

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
import digest as digest_mod  # noqa: E402
import ingest  # noqa: E402
import rank  # noqa: E402
import store  # noqa: E402
import summarize  # noqa: E402

PROJECT_ROOT = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv

    load_dotenv(PROJECT_ROOT / ".env")  # loads GEMINI_API_KEY from a local .env file, if present
except ImportError:
    pass  # python-dotenv not installed; GEMINI_API_KEY must already be set in the environment


def load_topics(config_path):
    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    return config.get("topics", [])


def run(topics_filter=None, dry_run=False, max_articles=20):
    config_path = PROJECT_ROOT / "config" / "topics.yaml"
    topics = load_topics(config_path)
    conn = store.get_connection(PROJECT_ROOT / "data" / "digest.db")
    # UTC, to match the ingested_at timestamps stored by store.py regardless
    # of the runner's local timezone.
    run_date = datetime.now(timezone.utc).date().isoformat()

    for topic in topics:
        if not topic.get("active", False):
            continue
        if topics_filter and topic["slug"] not in topics_filter:
            continue

        pending = store.get_pending(conn, topic["slug"])
        if pending:
            print(f"[{topic['slug']}] {len(pending)} pending article(s) from previous runs")

        print(f"[{topic['slug']}] fetching new entries...")
        new_entries = ingest.fetch_new_entries(topic, conn, store)
        print(f"[{topic['slug']}] {len(new_entries)} new article(s) fetched")

        candidates = pending + new_entries
        print(f"[{topic['slug']}] ranking {len(candidates)} candidate(s) for the top {max_articles}")
        selected = rank.rank_articles(candidates, top_n=max_articles, dry_run=dry_run)
        selected_ids = {entry["id"] for entry in selected}

        for entry in candidates:
            if entry["id"] not in selected_ids:
                store.mark_rejected(conn, entry["id"])
        rejected_count = len(candidates) - len(selected)
        if rejected_count:
            print(f"[{topic['slug']}] {rejected_count} candidate(s) ranked out, won't be re-considered")

        for entry in selected:
            try:
                result = summarize.summarize_article(entry["title"], entry["raw_excerpt"], dry_run=dry_run)
            except Exception as exc:  # noqa: BLE001 - one bad article shouldn't kill the batch
                print(f"  ! summarisation failed for {entry['link']}: {exc}", file=sys.stderr)
                # Store the real reason (truncated) rather than a generic
                # placeholder, so it's visible in the digest/DB without
                # needing to dig through the Actions run log separately.
                result = {"summary": f"(summarisation failed: {exc})"[:500], "entities": [], "themes": []}
            store.save_summary(
                conn, entry["id"], result.get("summary", ""), result.get("entities", []), result.get("themes", [])
            )

        articles = store.get_articles_for_digest(conn, topic["slug"], run_date)
        store.record_digest_run(conn, topic["slug"], run_date, len(articles))
        out_path = digest_mod.write_digest(PROJECT_ROOT, topic["slug"], topic["name"], run_date, articles)
        print(f"[{topic['slug']}] digest written to {out_path}")

    conn.close()


def main():
    parser = argparse.ArgumentParser(description="Run the daily digest pipeline.")
    parser.add_argument("--dry-run", action="store_true", help="Skip real LLM calls, use placeholder summaries.")
    parser.add_argument("--topics", nargs="*", help="Restrict to these topic slugs (default: all active).")
    parser.add_argument("--max-articles", type=int, default=10, help="Max new articles to summarise per topic per run.")
    args = parser.parse_args()
    run(topics_filter=args.topics, dry_run=args.dry_run, max_articles=args.max_articles)


if __name__ == "__main__":
    main()
