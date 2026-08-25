Renders a failed topic fetch. `rate_limited` uses the softer amber treatment; the rest use rust.

```jsx
<ErrorNotice kind={result.error.kind} message={result.error.message} />
```

Never rewrite `error.message` — the data layer already phrases it for readers.
