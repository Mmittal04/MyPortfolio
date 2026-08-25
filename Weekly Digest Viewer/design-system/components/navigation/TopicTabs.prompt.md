Top-level topic switcher; feed it `TOPICS` from the data layer verbatim.

```jsx
<TopicTabs topics={TOPICS} active={slug} onChange={setSlug} />
```

Underline colour comes from the topic slug, so tabs are colour-coded consistently with cards and tags.
