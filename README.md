# Day 38 - React Reconciliation Task

A React + Vite demonstration of stable keys, index keys, and omitted keys.

## Run

```bash
npm install
npm run dev
```

For a production compilation check, run `npm run build`.

## Checklist

1. Two comparison lists use `key={item.id}` and `key={index}`. The `Renders` badge in each memoized row shows render counts.
2. Shuffle and Reverse change the ordering; React reconciles rows.
3. Enable **Show missing keys** to show the third list without `key` (with expected React Console warning). Type in draft fields before reordering to demonstrate incorrect preservation with index/missing keys.
4. **Shuffle** always changes order; stable user IDs keep the draft with the right user.
5. React DevTools **Profiler**: install the React Developer Tools Chrome extension, open DevTools > Profiler, start recording, shuffle, stop recording, compare commits. The render counters are illustrative; use Profiler for timing, not the counters alone.

## Important

Missing and index keys are deliberate educational anti-patterns here. Keep proper stable keys in normal applications. A missing-keys warning is expected only when the third comparison is enabled. No external API is required.
