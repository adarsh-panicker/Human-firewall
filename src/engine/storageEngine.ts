import { StoredUserData, GameSession, SkillCategory, UserStats } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEY = 'human_firewall_v1_data';

const DEFAULT_STATS: UserStats = {
  totalGamesPlayed: 0,
  totalDecisionsMade: 0,
  saferDecisionsCount: 0,
  riskyDecisionsCount: 0,
  bestScore: 0,
  averageScore: 0,
  skillRatings: {
    phishing: { points: 0, maxPoints: 0, level: 1 },
    verification: { points: 0, maxPoints: 0, level: 1 },
    authentication: { points: 0, maxPoints: 0, level: 1 },
    privacy: { points: 0, maxPoints: 0, level: 1 },
    incident: { points: 0, maxPoints: 0, level: 1 },
    browsing: { points: 0, maxPoints: 0, level: 1 },
  },
  completedScenarios: []
};

const DEFAULT_DATA: StoredUserData = {
  profile: 'everyday',
  displayName: '',
  history: [],
  activeSession: null,
  achievements: INITIAL_ACHIEVEMENTS,
  stats: DEFAULT_STATS,
  preferences: {
    soundEffects: true,
    highContrast: false,
    showTimer: true
  }
};

export function loadUserData(): StoredUserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw);

    // Merge with defaults to ensure schema compatibility
    return {
      ...DEFAULT_DATA,
      ...parsed,
      preferences: {
        ...DEFAULT_DATA.preferences,
        ...(parsed.preferences || {})
      },
      stats: {
        ...DEFAULT_STATS,
        ...(parsed.stats || {})
      },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : INITIAL_ACHIEVEMENTS,
      history: Array.isArray(parsed.history) ? parsed.history : []
    };
  } catch (err) {
    console.error('Error reading localStorage for Human Firewall, using fallback:', err);
    return { ...DEFAULT_DATA };
  }
}

export function saveUserData(data: StoredUserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function updateStatsWithSession(stats: UserStats, session: GameSession): UserStats {
  const newStats: UserStats = {
    ...stats,
    totalGamesPlayed: stats.totalGamesPlayed + 1,
    totalDecisionsMade: stats.totalDecisionsMade + session.decisions.length,
    bestScore: Math.max(stats.bestScore, session.normalizedScore),
    completedScenarios: Array.from(new Set([
      ...stats.completedScenarios,
      ...session.decisions.map(d => d.scenarioId)
    ]))
  };

  let sessionSafer = 0;
  let sessionRisky = 0;

  session.decisions.forEach(d => {
    if (d.safety === 'safer') sessionSafer++;
    else sessionRisky++;

    const cat = d.category as SkillCategory;
    if (newStats.skillRatings[cat]) {
      newStats.skillRatings[cat].points += Math.max(0, d.scoreAwarded);
      newStats.skillRatings[cat].maxPoints += 25;
      const pct = (newStats.skillRatings[cat].points / (newStats.skillRatings[cat].maxPoints || 1)) * 100;
      newStats.skillRatings[cat].level = Math.max(1, Math.min(5, Math.ceil(pct / 20)));
    }
  });

  newStats.saferDecisionsCount = stats.saferDecisionsCount + sessionSafer;
  newStats.riskyDecisionsCount = stats.riskyDecisionsCount + sessionRisky;

  // Recalculate average
  const totalScoresSum = (stats.averageScore * stats.totalGamesPlayed) + session.normalizedScore;
  newStats.averageScore = Math.round(totalScoresSum / newStats.totalGamesPlayed);

  return newStats;
}

export function resetAllData(): StoredUserData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Could not remove localStorage:', e);
  }
  return { ...DEFAULT_DATA };
}

export function exportDataAsJson(data: StoredUserData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `human-firewall-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
