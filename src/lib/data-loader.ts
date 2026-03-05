import { CONFIG } from "@/config";
import { fetchCSV } from "@/lib/csv-parser";
import type { Player, Pick, WeeklyResult, Contestant, Announcement, AppData } from "@/types";

// ---- Demo / sample data for when no CSVs are configured ----

const DEMO_CONTESTANTS = [
  "Emma", "Sophia", "Olivia", "Ava", "Isabella",
  "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
  "Luna", "Camila", "Aria", "Scarlett", "Penelope",
  "Layla", "Chloe", "Victoria"
];

const DEMO_PLAYERS = ["Alex M.", "Jordan K.", "Sam R.", "Taylor W.", "Casey L.", "Morgan P.", "Riley S.", "Drew B."];

function generateDemoData(): AppData {
  const players: Player[] = DEMO_PLAYERS.map((name, i) => ({
    id: `p${i}`,
    name,
    totalPoints: Math.floor(Math.random() * 80) + 20,
    weeklyChange: Math.floor(Math.random() * 20) - 5,
    topPick: DEMO_CONTESTANTS[Math.floor(Math.random() * 5)],
  })).sort((a, b) => b.totalPoints - a.totalPoints);

  const picks: Pick[] = [];
  players.forEach((player) => {
    DEMO_CONTESTANTS.forEach((c, ci) => {
      picks.push({
        playerId: player.id,
        playerName: player.name,
        contestantName: c,
        rankPoints: DEMO_CONTESTANTS.length - ci,
      });
    });
  });

  const eliminated = new Set(DEMO_CONTESTANTS.slice(10));
  const contestants: Contestant[] = DEMO_CONTESTANTS.map((name, i) => ({
    name,
    status: eliminated.has(name) ? "eliminated" : "active",
    rosesThisWeek: eliminated.has(name) ? 0 : Math.floor(Math.random() * 3),
    totalRoses: Math.floor(Math.random() * 8) + 1,
    isLead: false,
  }));

  const results: WeeklyResult[] = [];
  for (let week = 1; week <= 4; week++) {
    DEMO_CONTESTANTS.forEach((c) => {
      const elim = eliminated.has(c) && week === 4;
      results.push({
        week,
        episodeDate: CONFIG.EPISODE_SCHEDULE[week - 1] || "",
        contestantName: c,
        receivedRose: !elim,
        eliminated: elim,
        rosesThisWeek: elim ? 0 : 1,
      });
    });
  }

  const announcements: Announcement[] = [
    {
      date: "2025-03-10",
      headline: "Welcome to Bachelor Bracket HQ! 🌹",
      body: "The bracket pool is officially open. All picks are locked after Episode 3. Good luck!",
    },
    {
      date: "2025-03-17",
      headline: "Week 2 Results Are In",
      body: "Some shakeups on the leaderboard this week. Check out who's climbing!",
    },
    {
      date: "2025-03-24",
      headline: "Picks are now LOCKED 🔒",
      body: "Episode 3 has aired. All rankings are final for the rest of the season.",
    },
  ];

  return {
    players,
    picks,
    results,
    contestants,
    announcements,
    lastUpdated: new Date(),
    loading: false,
    error: null,
  };
}

// ---- Real data loading ----

function parsePlayersCSV(rows: Record<string, string>[]): Player[] {
  return rows.map((r, i) => ({
    id: r.id || `p${i}`,
    name: r.name || r.player_name || "",
    totalPoints: 0, // computed later
    weeklyChange: r.weekly_change ? parseInt(r.weekly_change) : undefined,
    topPick: r.top_pick || r["#1_pick"] || undefined,
  }));
}

function parsePicksCSV(rows: Record<string, string>[]): Pick[] {
  return rows.map((r) => ({
    playerId: r.player_id || r.id || "",
    playerName: r.player_name || r.name || "",
    contestantName: r.contestant_name || r.contestant || "",
    rankPoints: parseInt(r.rank_points || r.points || "0"),
  }));
}

function parseResultsCSV(rows: Record<string, string>[]): WeeklyResult[] {
  return rows.map((r) => ({
    week: parseInt(r.week || "0"),
    episodeDate: r.episode_date || r.date || "",
    contestantName: r.contestant_name || r.contestant || "",
    receivedRose: r.received_rose === "true" || r.received_rose === "1" || r.rose === "true" || r.rose === "1",
    eliminated: r.eliminated === "true" || r.eliminated === "1",
    rosesThisWeek: parseInt(r.roses_this_week || r.roses || "0"),
  }));
}

function parseAnnouncementsCSV(rows: Record<string, string>[]): Announcement[] {
  return rows.map((r) => ({
    date: r.date || "",
    headline: r.headline || r.title || "",
    body: r.body || r.content || r.description || "",
    link: r.link || r.url || undefined,
  }));
}

function computeScores(players: Player[], picks: Pick[], results: WeeklyResult[]): Player[] {
  // Build rose totals per contestant
  const roseMap: Record<string, number> = {};
  results.forEach((r) => {
    if (r.receivedRose) {
      roseMap[r.contestantName] = (roseMap[r.contestantName] || 0) + r.rosesThisWeek;
    }
  });

  // Compute player totals
  const playerTotals: Record<string, number> = {};
  const playerTopPick: Record<string, string> = {};

  picks.forEach((pick) => {
    const key = pick.playerId || pick.playerName;
    const roses = roseMap[pick.contestantName] || 0;
    const earned = pick.rankPoints * roses;
    playerTotals[key] = (playerTotals[key] || 0) + earned;

    // Track top pick (highest rank points)
    if (!playerTopPick[key]) {
      playerTopPick[key] = pick.contestantName;
    }
  });

  // Find top pick per player (highest rank_points)
  const topPicks: Record<string, { name: string; pts: number }> = {};
  picks.forEach((pick) => {
    const key = pick.playerId || pick.playerName;
    if (!topPicks[key] || pick.rankPoints > topPicks[key].pts) {
      topPicks[key] = { name: pick.contestantName, pts: pick.rankPoints };
    }
  });

  return players.map((p) => {
    const key = p.id || p.name;
    return {
      ...p,
      totalPoints: playerTotals[key] || 0,
      topPick: topPicks[key]?.name || p.topPick,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
}

function buildContestants(results: WeeklyResult[]): Contestant[] {
  const map: Record<string, Contestant> = {};
  results.forEach((r) => {
    if (!map[r.contestantName]) {
      map[r.contestantName] = {
        name: r.contestantName,
        status: "active",
        rosesThisWeek: 0,
        totalRoses: 0,
      };
    }
    const c = map[r.contestantName];
    if (r.eliminated) {
      c.status = "eliminated";
      c.eliminatedWeek = r.week;
    }
    c.totalRoses += r.rosesThisWeek;
    // Keep the latest week's roses
    if (!c.eliminatedWeek || r.week >= c.eliminatedWeek) {
      c.rosesThisWeek = r.rosesThisWeek;
    }
  });
  return Object.values(map);
}

export async function loadAppData(): Promise<AppData> {
  const endpoints = CONFIG.DATA_ENDPOINTS;
  const hasEndpoints = Object.values(endpoints).some((u) => u.length > 0);
  const hasSingle = CONFIG.SINGLE_CSV_URL.length > 0;

  if (!hasEndpoints && !hasSingle) {
    // No data configured — return demo data
    return generateDemoData();
  }

  try {
    let players: Player[] = [];
    let picks: Pick[] = [];
    let results: WeeklyResult[] = [];
    let announcements: Announcement[] = [];

    if (hasEndpoints) {
      const [pRows, pickRows, resRows, annRows] = await Promise.all([
        fetchCSV(endpoints.players_csv_url),
        fetchCSV(endpoints.picks_csv_url),
        fetchCSV(endpoints.results_csv_url),
        fetchCSV(endpoints.announcements_csv_url),
      ]);

      players = parsePlayersCSV(pRows);
      picks = parsePicksCSV(pickRows);
      results = parseResultsCSV(resRows);
      announcements = parseAnnouncementsCSV(annRows);
    } else if (hasSingle) {
      const rows = await fetchCSV(CONFIG.SINGLE_CSV_URL);
      players = parsePlayersCSV(rows.filter((r) => r.type === "player"));
      picks = parsePicksCSV(rows.filter((r) => r.type === "pick"));
      results = parseResultsCSV(rows.filter((r) => r.type === "result"));
      announcements = parseAnnouncementsCSV(rows.filter((r) => r.type === "announcement"));
    }

    const scoredPlayers = computeScores(players, picks, results);
    const contestants = buildContestants(results);

    return {
      players: scoredPlayers,
      picks,
      results,
      contestants,
      announcements,
      lastUpdated: new Date(),
      loading: false,
      error: null,
    };
  } catch (err) {
    return {
      players: [],
      picks: [],
      results: [],
      contestants: [],
      announcements: [],
      lastUpdated: null,
      loading: false,
      error: err instanceof Error ? err.message : "Failed to load data",
    };
  }
}
