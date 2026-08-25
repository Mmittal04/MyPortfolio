"""Render a topic's articles for a given run into a Markdown digest file."""

from pathlib import Path

from jinja2 import Template

DIGEST_TEMPLATE = """# {{ topic_name }} — Weekly Digest — {{ run_date }}

{% if articles %}
{{ articles|length }} new article(s) this week.

{% for a in articles %}
## [{{ a.title }}]({{ a.link }})

{{ a.summary }}

**Themes:** {{ a.themes|join(', ') if a.themes else '—' }}
**Entities:** {{ a.entities|map(attribute='text')|join(', ') if a.entities else '—' }}
**Feed:** {{ a.source_feed if a.source_feed else '—' }}

---
{% endfor %}
{% else %}
No new articles for this topic this week.
{% endif %}
"""


def render_digest(topic_name, run_date, articles):
    return Template(DIGEST_TEMPLATE).render(topic_name=topic_name, run_date=run_date, articles=articles)


def write_digest(project_root, topic_slug, topic_name, run_date, articles):
    out_dir = Path(project_root) / "digests" / topic_slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{run_date}.md"
    out_path.write_text(render_digest(topic_name, run_date, articles), encoding="utf-8")
    return out_path
