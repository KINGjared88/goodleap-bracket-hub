

## Plan: Four UI Fixes

### 1. Differentiate Breaking News banner from Bracket HQ hero
Both use similar purple gradients. Add a visible border and slightly adjust the ticker background.

**`src/index.css`** — Update `.headline-ticker` in light mode: add a `border: 2px solid hsl(270 60% 60% / 0.5)` and shift the gradient slightly lighter/different angle to visually separate it from the hero below.

### 2. Hide RSS feed error notifications on the News page
Users shouldn't see HTTP 403/404 errors from failed feeds.

**`src/pages/ExternalNewsPage.tsx`** — Remove the `feedErrors` display block (lines 75-84). Keep the state internally for debugging via console.log, but don't render the error banners.

### 3. Remove "Hot" badge from contestant scouting cards
The fire/HOT icon on most-drafted contestants is unwanted.

**`src/pages/ContestantsPage.tsx`** — Remove the "Most drafted badge" block (lines 138-142) and clean up the `isMostDrafted` variable and related imports (`Flame`).

### 4. Move Top 3 Power Rankings into the sidebar, remove from HQ main column
Replace the large `PowerRankingsPodium` component on the home page with a compact Top 3 list in the `WarRoomSidebar`.

**`src/pages/HomePage.tsx`** — Remove the `PowerRankingsPodium` component definition (lines 38-74) and its render call (lines 139-142).

**`src/components/WarRoomSidebar.tsx`** — Add a new "Top 3" card at the top of the sidebar (after Live Status), showing the top 3 players with medal emojis, names, and points. Use `data.players.slice(0, 3)`.

### Files to edit:
1. `src/index.css` — headline-ticker border
2. `src/pages/ExternalNewsPage.tsx` — hide error display
3. `src/pages/ContestantsPage.tsx` — remove Hot badge
4. `src/pages/HomePage.tsx` — remove PowerRankingsPodium
5. `src/components/WarRoomSidebar.tsx` — add Top 3 ranking card

