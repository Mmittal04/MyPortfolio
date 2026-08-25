Standard action button — use for the single meaningful action on a view; `secondary`/`ghost` for supporting actions.

```jsx
<Button variant="primary" size="md" href="https://example.com">Read the source</Button>
<Button variant="ghost" size="sm" iconLeft={<Icon name="rotate-cw" />}>Refresh</Button>
```

Variants: `primary` (clay fill), `secondary` (card surface + hairline), `ghost` (text only, clay tint on hover), `quiet` (sand chip). Press state nudges 1px down; never scales.
