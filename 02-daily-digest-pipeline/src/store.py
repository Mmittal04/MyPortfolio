"""SQLite persistence layer for the daily digest pipeline.

Schema:
- articles:    one row per ingested article, keyed by a hash of its link.
               status is one of 'pending' (seen, not yet judged),
               'summarized' (selected by ranking and summarised),
               'failed' (selected and summarisation genuinely failed --
               API/model error, not a ranking call -- retry-eligible next
               run), or 'rejected' (ranked out, or a 'failed' article that
               exhausted MAX_RETRIES; never shown or reconsidered again).
- entities:    named entities extracted per article (many-to-one)
- themes:      theme tags extracted per article (many-to-one)
- digest_runs: one row per (topic, day) recording how many articles ran
"""

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    topic_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    source_feed TEXT,
    published_at TEXT,
    ingested_at TEXT NOT NULL,
    summary TEXT,
    raw_excerpt TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    retry_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id TEXT NOT NULL REFERENCES articles(id),
    entity_text TEXT NOT NULL,
    entity_type TEXT
);

CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id TEXT NOT NULL REFERENCES articles(id),
    theme TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS digest_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_slug TEXT NOT NULL,
    run_date TEXT NOT NULL,
    article_count INTEGER NOT NULL,
    UNIQUE(topic_slug, run_date)
);
"""


def get_connection(db_path):
    db_path = Path(db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA)
    _migrate(conn)
    return conn


def _migrate(conn):
    """Add columns to databases created before they existed, backfilling
    so rows already processed under an older schema aren't treated as
    pending again -- and reclassify rows saved under the old
    save_summary-for-everything behaviour, where a genuine summarisation
    failure was stored as status='summarized' with a placeholder summary
    text, indistinguishable from a real success. Runs every connection
    (cheap once caught up) so it self-heals a DB from any prior version.
    """
    columns = {row[1] for row in conn.execute("PRAGMA table_info(articles)")}
    if "status" not in columns:
        conn.execute("ALTER TABLE articles ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'")
        conn.execute("UPDATE articles SET status = 'summarized' WHERE summary IS NOT NULL")
    if "retry_count" not in columns:
        conn.execute("ALTER TABLE articles ADD COLUMN retry_count INTEGER NOT NULL DEFAULT 0")
    conn.execute(
        "UPDATE articles SET status = 'failed' "
        "WHERE status = 'summarized' AND summary LIKE '(summarisation failed%'"
    )
    conn.commit()


def article_exists(conn, article_id):
    cur = conn.execute("SELECT 1 FROM articles WHERE id = ?", (article_id,))
    return cur.fetchone() is not None


def insert_article_stub(conn, article_id, topic_slug, title, link, source_feed, published_at, raw_excerpt):
    conn.execute(
        """INSERT OR IGNORE INTO articles
           (id, topic_slug, title, link, source_feed, published_at, ingested_at, raw_excerpt, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')""",
        (
            article_id,
            topic_slug,
            title,
            link,
            source_feed,
            published_at,
            datetime.now(timezone.utc).isoformat(),
            raw_excerpt,
        ),
    )
    conn.commit()


def save_summary(conn, article_id, summary, entities, themes):
    conn.execute(
        "UPDATE articles SET summary = ?, status = 'summarized' WHERE id = ?", (summary, article_id)
    )
    for ent in entities or []:
        conn.execute(
            "INSERT INTO entities (article_id, entity_text, entity_type) VALUES (?, ?, ?)",
            (article_id, ent.get("text", ""), ent.get("type", "")),
        )
    for theme in themes or []:
        conn.execute("INSERT INTO themes (article_id, theme) VALUES (?, ?)", (article_id, theme))
    conn.commit()


def mark_rejected(conn, article_id):
    """Mark an article as considered and ranked out, so it's never
    re-summarised or shown, and never competes in ranking again either."""
    conn.execute("UPDATE articles SET status = 'rejected' WHERE id = ?", (article_id,))
    conn.commit()


MAX_RETRIES = 3


def save_failure(conn, article_id, reason):
    """Mark an article as selected and attempted, but not successfully
    summarised -- a genuine API/model failure, not a ranking rejection.
    Stays 'failed' (retry-eligible via get_pending, so it competes in
    ranking again next run) until it has failed MAX_RETRIES times, at
    which point it's marked 'rejected' instead so a persistently-broken
    article (e.g. permanently blocked content) doesn't retry forever.
    """
    retry_count = conn.execute(
        "SELECT retry_count FROM articles WHERE id = ?", (article_id,)
    ).fetchone()[0] + 1
    status = "rejected" if retry_count >= MAX_RETRIES else "failed"
    conn.execute(
        "UPDATE articles SET summary = ?, status = ?, retry_count = ? WHERE id = ?",
        (reason, status, retry_count, article_id),
    )
    conn.commit()


def record_digest_run(conn, topic_slug, run_date, article_count):
    conn.execute(
        """INSERT INTO digest_runs (topic_slug, run_date, article_count) VALUES (?, ?, ?)
           ON CONFLICT(topic_slug, run_date) DO UPDATE SET article_count = excluded.article_count""",
        (topic_slug, run_date, article_count),
    )
    conn.commit()


def get_pending(conn, topic_slug, limit=60):
    """Articles eligible to compete in ranking again: never judged yet
    ('pending'), or a genuine summarisation failure that hasn't exhausted
    its retries ('failed'). Oldest first. Capped at `limit` to bound both
    the query and the size of the ranking prompt regardless of how large
    a backlog might get.
    """
    cur = conn.execute(
        """SELECT id, title, link, raw_excerpt FROM articles
           WHERE topic_slug = ? AND status IN ('pending', 'failed')
           ORDER BY ingested_at ASC LIMIT ?""",
        (topic_slug, limit),
    )
    return [
        {"id": r[0], "title": r[1], "link": r[2], "raw_excerpt": r[3]}
        for r in cur.fetchall()
    ]


def get_articles_for_digest(conn, topic_slug, run_date):
    """Summarised (not pending or rejected) articles ingested on run_date
    (YYYY-MM-DD, UTC) for a given topic."""
    cur = conn.execute(
        """SELECT id, title, link, summary, published_at FROM articles
           WHERE topic_slug = ? AND date(ingested_at) = ? AND status = 'summarized'
           ORDER BY published_at DESC""",
        (topic_slug, run_date),
    )
    rows = cur.fetchall()
    articles = []
    for article_id, title, link, summary, published_at in rows:
        ent_cur = conn.execute(
            "SELECT entity_text, entity_type FROM entities WHERE article_id = ?", (article_id,)
        )
        entities = [{"text": t, "type": ty} for t, ty in ent_cur.fetchall()]
        theme_cur = conn.execute("SELECT theme FROM themes WHERE article_id = ?", (article_id,))
        themes = [t[0] for t in theme_cur.fetchall()]
        articles.append(
            {
                "id": article_id,
                "title": title,
                "link": link,
                "summary": summary,
                "published_at": published_at,
                "entities": entities,
                "themes": themes,
            }
        )
    return articles
