The repeating unit of the digest. Maps one-to-one onto an entry in `DigestResult.articles`.

```jsx
{result.articles.map((a,i)=>(
  <ArticleCard key={a.link} article={a} topic={result.topic.slug} index={i} />
))}
```

Titles open the original source in a new tab. Entities render as a middot-joined run, not as pills, so themes stay the only chips on the card.

Double-clicking anywhere on the card opens the feed it was summarised from — `feedUrl` if given, otherwise `article.feedUrl`, otherwise `article.link`. The title link stays the single-click path to the article itself.
