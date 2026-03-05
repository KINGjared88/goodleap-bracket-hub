

## Plan: Switch Accent from Pink to Purple + Fix News Relevance

Two issues to address:

### 1. Change Pink/Rose Accents to Purple

The current `--primary` is `350 72% 50%` (rose-red/pink). Switching to a rich purple throughout.

**`src/index.css`** — Update color tokens in both `:root` and `.dark`:

**Light mode (`:root`)**:
- `--primary`: `350 72% 50%` → `270 60% 50%` (vivid purple)
- `--accent`: `350 55% 45%` → `270 50% 42%`
- `--ring`: → `270 60% 50%`
- `--rose-red` / `--rose-red-glow`: shift to purple hues (`270`)
- `--gradient-hero`: replace rose tints with purple tints
- `--gradient-accent`: purple-to-champagne gradient
- `--shadow-glow-rose`: shift to purple glow
- `--shadow-card-hover`: purple glow instead of rose
- All hardcoded `hsl(350 ...)` references in component classes (`.glass-card:hover`, `.headline-ticker`, `.rose-badge`, `.stat-card:hover`, `.scouting-card:hover`, `.rose-overlay`, `.eliminated-sash`, `.page-bg::before` gradients) → shift `350` hue to `270`
- Sidebar primary/ring: → `270 60% 50%`

**Dark mode (`.dark`)**:
- Same hue shifts: all `350` → `270` for primary, accent, ring, glows, gradients, sidebar

**`src/components/AppNav.tsx`** — The nav uses `text-primary` and `bg-primary/15` which will automatically pick up the new purple from CSS variables. No code changes needed.

**`src/components/WarRoomSidebar.tsx`** — Uses `text-primary` and `bg-primary`, will auto-update. No changes needed.

### 2. Fix News to be Bachelorette-Specific

The current RSS feeds are general entertainment (Us Weekly full feed, People full feed, E! News top stories). These return generic celebrity news, not Bachelorette content.

**`src/config.ts`** — Replace generic feeds with Bachelorette-specific ones:
- Keep ET Bachelorette feed (already specific)
- Replace generic Us Weekly with their Bachelor tag feed
- Replace generic People with their Bachelorette tag feed  
- Replace E! News generic with their Bachelorette/Bachelor tag
- Replace Reality Tea generic with their Bachelor category
- Add Screen Rant Bachelor feed

**`supabase/functions/rss-proxy/index.ts`** — Add Bachelorette keyword filtering: after fetching and parsing all feeds, filter articles to only include those whose title or summary contains keywords like "bachelorette", "bachelor", "rose ceremony", the lead name, or contestant names. This ensures even general feeds only surface relevant content.

### Files to edit:
1. `src/index.css` — all pink/rose hue references (`350`) → purple (`270`)
2. `src/config.ts` — replace generic RSS feeds with Bachelorette-specific URLs
3. `supabase/functions/rss-proxy/index.ts` — add keyword relevance filter

