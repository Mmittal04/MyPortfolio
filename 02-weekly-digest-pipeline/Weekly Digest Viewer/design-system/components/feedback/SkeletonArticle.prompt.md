Fills a topic panel while `loadAllDigests()` is in flight.

```jsx
{loading ? <SkeletonArticle count={3} /> : <ArticleList articles={result.articles} topic={slug} />}
```
