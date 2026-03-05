

## Plan: Lighten the Background

The background is currently at `280 30% 16%` (HSL lightness 16%). Bumping it ~50% lighter means going to about `24%` lightness — a warm plum-gray that's noticeably lighter but still dark-mode. Cards stay at `22%`, so they'll actually be slightly darker than the background, creating a nice inset/recessed card effect.

### Changes (single file: `src/index.css`)

1. **Background**: `280 30% 16%` → `280 25% 24%`
2. **Muted**: `275 20% 26%` → `275 20% 30%` (keep proportional)
3. **Border**: `275 20% 30%` → `275 20% 34%`
4. **Input**: `275 20% 28%` → `275 20% 32%`
5. **Cards stay at `275 25% 22%`** — they'll appear as slightly darker panels against the lighter background, giving good contrast without washing out
6. **Glass-bg stays as-is** — already lighter than new background
7. **Nav-dark**: lighten slightly to `280 28% 22%` so it's distinguishable but still anchored
8. **Sidebar background**: `280 28% 15%` → `280 28% 22%`
9. **Background gradients in `.page-bg::before`**: Increase gradient opacity slightly since the base is lighter now

No other files need changes.

