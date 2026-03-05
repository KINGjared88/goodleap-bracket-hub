

## Plan: Add Light Mode + Fix RSS News Sources

Two tasks: (1) add a light/dark mode toggle with light as default, and (2) investigate and fix the single-source news issue.

---

### Task 1: Light Mode with Toggle

**Root Cause**: The CSS only defines one color scheme under `:root`. Tailwind's `darkMode: ["class"]` is already configured, but there's no `.dark` class variant and no toggle mechanism.

**Approach**: Use `next-themes` (already installed) to manage the theme. Define light mode colors under `:root` and dark mode under `.dark`.

#### Files to edit:

**`src/index.css`**
- Move current dark palette into `.dark { ... }` selector
- Add a new `:root` (light mode) palette with warm, readable colors:
  - Background: warm off-white (`0 0% 98%`)
  - Cards: white with subtle rose-tinted shadows
  - Text: dark charcoal (`240 10% 10%`)
  - Muted foreground: medium gray (`215 15% 45%`)
  - Keep primary rose-red and secondary champagne-gold consistent
  - Borders: light gray (`220 13% 91%`)
- Update component classes (`.glass-card`, `.nav-dark`, `.hero-gradient`, `.page-bg`, etc.) to use CSS variables so they adapt automatically, OR add `.dark` overrides where hardcoded HSL values exist
- Light mode `.page-bg::before`: soft rose/champagne radial glows at low opacity on a white base
- Light mode `.glass-card`: white background with subtle border and soft shadow
- Light mode `.nav-dark`: white/frosted background with light border
- Light mode `.headline-ticker`, `.bulletin-card`, badges: lighter, more pastel versions

**`src/App.tsx`**
- Wrap app in `ThemeProvider` from `next-themes` with `defaultTheme="light"` and `attribute="class"`

**`src/components/AppNav.tsx`**
- Add a Sun/Moon toggle button in the navbar (desktop and mobile) using `useTheme()` from `next-themes`

**`index.html`**
- No changes needed; `next-themes` handles the class injection

---

### Task 2: RSS News — Single Source Issue

**Root Cause**: The `CONFIG.RSS_FEEDS` array only contains two feeds, both from `etonline.com` (Entertainment Tonight). That's why all news appears to come from one website. There are no errors — the feeds work fine, they're just both from the same domain.

**Fix**: Add more diverse RSS feeds from different Bachelorette/Bachelor news sources to `src/config.ts`:
- Reality Steve (popular Bachelor Nation blog)
- Us Weekly Entertainment RSS
- People Magazine TV RSS
- E! News RSS

These are well-known sources with public RSS feeds that the edge function proxy can fetch.

#### Files to edit:

**`src/config.ts`**
- Add 3-4 additional RSS feed sources from different domains

**`supabase/functions/rss-proxy/index.ts`**
- Add a more flexible User-Agent string to avoid potential blocks from some sites
- Add timeout handling for slow feeds so one slow feed doesn't block others

---

### Summary of files to change:
1. `src/index.css` — light mode palette + dark mode under `.dark`
2. `src/App.tsx` — wrap in ThemeProvider
3. `src/components/AppNav.tsx` — add theme toggle button
4. `src/config.ts` — add diverse RSS feed sources
5. `supabase/functions/rss-proxy/index.ts` — improve fetch resilience

