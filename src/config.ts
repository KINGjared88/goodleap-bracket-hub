// ============================================================
// SINGLE SOURCE OF TRUTH — CONFIGURATION
// Edit these values to connect to your Excel-exported CSVs.
// ============================================================

export const CONFIG = {
  /** Buy-in amount per player in dollars */
  BUY_IN_AMOUNT: 10,

  /** Episode air dates (ISO strings or "YYYY-MM-DD") */
  EPISODE_SCHEDULE: [
    "2025-03-10",
    "2025-03-17",
    "2025-03-24",
    "2025-03-31",
    "2025-04-07",
    "2025-04-14",
    "2025-04-21",
    "2025-04-28",
    "2025-05-05",
    "2025-05-12",
    "2025-05-19",
  ],

  /** CSV data endpoints — paste your public CSV download URLs here */
  DATA_ENDPOINTS: {
    players_csv_url: "",   // e.g. "https://onedrive.live.com/download?..."
    picks_csv_url: "",     // player picks CSV
    results_csv_url: "",   // weekly results CSV (roses, eliminations)
    announcements_csv_url: "", // announcements CSV
  },

  /**
   * If you only have ONE CSV with a `type` column
   * ("player" | "pick" | "result" | "announcement"),
   * paste it here instead. The individual URLs above take priority.
   */
  SINGLE_CSV_URL: "",

  /** RSS / Atom feed URLs for external news */
  NEWS_FEEDS: [
    // "https://example.com/bachelor-rss.xml",
  ],

  /** News cache duration in minutes */
  NEWS_CACHE_MINUTES: 30,

  /** Image cache refresh interval in days */
  IMAGE_CACHE_DAYS: 7,

  /** Season lead name (Bachelorette / Bachelor) */
  LEAD_NAME: "The Bachelorette",
} as const;
