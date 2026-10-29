import { Achievement, GameSession } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

export interface AchievementEvaluationResult {
  updatedAchievements: Achievement[];
  newlyUnlocked: Achievement[];
}

export function evaluateAchievements(
  currentSession: GameSession,
  allSessions: GameSession[],
  existingAchievements: Achievement[]
): AchievementEvaluationResult {
  const achievementsMap = new Map<string, Achievement>();

  // Initialize with initial list or existing
  INITIAL_ACHIEVEMENTS.forEach(a => achievementsMap.set(a.id, { ...a }));
  existingAchievements.forEach(a => {
    if (achievementsMap.has(a.id)) {
      achievementsMap.set(a.id, { ...achievementsMap.get(a.id)!, ...a });
    } else {
      achievementsMap.set(a.id, a);
    }
  });

  const newlyUnlocked: Achievement[] = [];
  const now = Date.now();

  const unlock = (id: string) => {
    const ach = achievementsMap.get(id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = now;
      newlyUnlocked.push(ach);
    }
  };

  // Combine decisions from all completed sessions + current
  const allDecisions = [
    ...allSessions.flatMap(s => s.decisions),
    ...currentSession.decisions
  ];

  // 1. First Line of Defense: Completed first game
  if (currentSession.completed || allSessions.length > 0) {
    unlock('first-defense');
  }

  // 2. Verify First: 3+ safer verification decisions
  const safeVerifications = allDecisions.filter(
    d => d.category === 'verification' && d.safety === 'safer'
  ).length;
  if (safeVerifications >= 3) {
    unlock('verify-first');
  }

  // 3. Phishing Spotter: 3+ safer phishing decisions
  const safePhishing = allDecisions.filter(
    d => d.category === 'phishing' && d.safety === 'safer'
  ).length;
  if (safePhishing >= 3) {
    unlock('phishing-spotter');
  }

  // 4. Incident Responder: 2+ safer incident decisions
  const safeIncidents = allDecisions.filter(
    d => d.category === 'incident' && d.safety === 'safer'
  ).length;
  if (safeIncidents >= 2) {
    unlock('incident-responder');
  }

  // 5. Perfect Round: All decisions in this session are safer (min 3 decisions)
  if (
    currentSession.completed &&
    currentSession.decisions.length >= 3 &&
    currentSession.decisions.every(d => d.safety === 'safer')
  ) {
    unlock('perfect-round');
  }

  // 6. Learning in Progress: Current score higher than prior sessions
  if (currentSession.completed && allSessions.length > 0) {
    const previousMax = Math.max(...allSessions.map(s => s.normalizedScore));
    if (currentSession.normalizedScore > previousMax) {
      unlock('learning-progress');
    }
  }

  // 7. Zero Trust Champion: Full challenge with score >= 85
  if (
    currentSession.completed &&
    currentSession.mode === 'full' &&
    currentSession.normalizedScore >= 85
  ) {
    unlock('zero-trust');
  }

  // 8. Crisis Containment Specialist: Completed a recovery branching scenario
  const hasCompletedRecovery = allDecisions.some(
    d => (d.scenarioId.includes('-compromise') || d.scenarioId.includes('-fraud')) && d.safety === 'safer'
  );
  if (hasCompletedRecovery) {
    unlock('safe-recovery');
  }

  return {
    updatedAchievements: Array.from(achievementsMap.values()),
    newlyUnlocked
  };
}
