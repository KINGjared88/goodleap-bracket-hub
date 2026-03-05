

## Problem

The current theme is too dark and dull. The background feels like a black void, cards don't stand out, and the navbar text is hard to read. You want a warmer, richer base with more color vibrancy.

## Plan

### 1. Warm up the background color
Shift from cold dark purple (`250 40% 13%`) to a **deep plum-burgundy** base (`280 30% 16%`). This adds warmth without going red. The background gradients will also shift warmer with more visible purple and rose tones.

### 2. Brighten the cards
- Increase card background lightness from 18% to ~22-24%
- Make `--glass-bg` more opaque and lighter so cards clearly pop against the background
- Add a subtle purple or warm border glow so cards feel "lit up"

### 3. Fix the navbar readability
- Make the nav background more opaque and slightly lighter
- Change inactive tab text from `muted-foreground` (currently 65% lightness gray) to brighter off-white (~80%)
- Active tab gets a stronger purple glow background with white text
- Increase font weight on nav items

### 4. Boost muted-foreground and secondary text
- Raise `--muted-foreground` from `215 20% 65%` to `215 20% 75%` so secondary text is actually readable

### 5. Enrich background gradients
- Increase opacity on the purple and rose radial gradients in `.page-bg::before`
- Add a warm rose/plum ambient wash so the background feels alive, not flat

### 6. Power Rankings & cards on HQ
- The power ranking cards and stat cards will benefit from the glass-bg changes automatically
- The orange breaking banner is already vibrant; no changes needed there

### Files to edit
- `src/index.css` — color tokens, background gradients, nav-dark, glass-card
- `src/components/AppNav.tsx` — stronger text contrast for nav items

