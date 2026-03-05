

## Plan: Fix White Text on Light Backgrounds

### Root Cause

The `hero-gradient` in light mode uses a very light pastel gradient (`hsl(270 20% 95%)` — nearly white), but all hero sections and the headline ticker use `text-primary-foreground` (white, `0 0% 100%`). White text on a near-white background is invisible.

The same problem affects the `headline-ticker` class — it has `color: hsl(270 40% 35%)` set in CSS, but the JSX applies `text-primary-foreground` which overrides it via Tailwind specificity.

### Fix Approach

Two-pronged: (1) make the light-mode hero/ticker backgrounds dark enough for white text, OR (2) change the text color. Option 1 is better — it preserves the "War Room" premium look.

### Changes

**`src/index.css`** — Update light mode variables and classes:

1. **`--gradient-hero`**: Change from pastel (`270 20% 95%`) to a rich purple gradient that supports white text:
   - `linear-gradient(135deg, hsl(270 45% 40%), hsl(270 35% 50%), hsl(38 40% 45%))` — deep purple-to-champagne

2. **`--gradient-accent`**: Already dark enough (purple-to-gold), no change needed.

3. **`.headline-ticker`** (light mode): Change from pastel purple (`hsl(270 40% 92%)`) to a deeper purple background:
   - `linear-gradient(135deg, hsl(270 50% 42%), hsl(270 40% 50%))` — matches the hero darkness
   - Set `color: white` so the `text-primary-foreground` Tailwind class isn't fighting the CSS

4. **`.stat-card-accent`**: Already uses `--gradient-accent`, should be fine.

5. **`--shadow-hero`** in light mode: Adjust to complement the darker hero — make it slightly more purple-tinted.

No other files need changes — the JSX correctly uses `text-primary-foreground` which will be legible against the darker backgrounds.

### Files to edit
1. `src/index.css` — update `--gradient-hero`, `.headline-ticker` light mode backgrounds to be dark enough for white text

