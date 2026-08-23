"""Fetch new entries for a topic from its RSS/Atom feeds, dedupe against the
SQLite store, and insert a stub row (no summary yet) for each genuinely new
article.
"""

import hashlib

import feedparser


def make_article_id(link):
    return hashlib.sha256(link.encode("utf-8")).hexdigest()[:16]


def fetch_new_entries(topic, conn, store):
    """Returns a list of new-entry dicts ready for summarisation.

    Each feed is parsed independently so one broken feed doesn't take down
    the whole topic. Entries already seen (by link hash) are skipped, and
    an insert-stub is written immediately so a crash mid-run doesn't cause
    the same article to be double-counted or double-charged on retry.
    """
    new_entries = []
    keywords = [k.lower() for k in topic.get("keywords", [])]

    for feed_url in topic.get("feeds", []):
        try:
            parsed = feedparser.parse(feed_url)
        except Exception as exc:  # noqa: BLE001 - one bad feed shouldn't kill the run
            print(f"  ! could not parse feed {feed_url}: {exc}")
            continue

        for entry in parsed.entries:
            link = entry.get("link", "")
            title = entry.get("title", "")
            if not link or not title:
                continue

            raw_excerpt = entry.get("summary", "") or entry.get("description", "")

            if keywords:
                haystack = f"{title} {raw_excerpt}".lower()
                if not any(k in haystack for k in keywords):
                    continue

            article_id = make_article_id(link)
            if store.article_exists(conn, article_id):
                continue

            published = entry.get("published", entry.get("updated", ""))
            store.insert_article_stub(
                conn, article_id, topic["slug"], title, link, feed_url, published, raw_excerpt
            )
            new_entries.append(
                {
                    "id": article_id,
                    "title": title,
                    "link": link,
                    "raw_excerpt": raw_excerpt,
                    "published_at": published,
                }
            )

    return new_entries
