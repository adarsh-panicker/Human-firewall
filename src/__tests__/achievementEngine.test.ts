import { describe, it, expect } from 'vitest';
import { evaluateAchievements } from '../engine/achievementEngine';
import { GameSession, PlayerDecision } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

describe('Achievement Engine', () => {
  it('unlocks First Line of Defense upon completing first session', () => {
    const session: GameSession = {
      sessionId: 'TEST-1',
      mode: 'quick',
      profile: 'everyday',
      displayName: 'Alex',
      startTime: Date.now(),
      decisions: [
        {
          scenarioId: 'sc-1',
          scenarioTitle: 'Test',
          category: 'phishing',
          optionId: 'opt-1',
          chosenText: 'Safe',
          safety: 'safer',
          scoreAwarded: 25,
          skillImpact: { skill: 'phishing', points: 20 },
          timestamp: Date.now(),
          timeSpentSeconds: 10,
          consequence: 'Blocked',
          securityPrinciple: 'Inspection'
        }
      ],
      totalScore: 25,
      normalizedScore: 100,
      completed: true,
      scenarioQueue: ['sc-1'],
      currentScenarioIndex: 0
    };

    const { updatedAchievements, newlyUnlocked } = evaluateAchievements(session, [], INITIAL_ACHIEVEMENTS);
    const firstDefense = updatedAchievements.find(a => a.id === 'first-defense');
    expect(firstDefense?.unlockedAt).toBeDefined();
    expect(newlyUnlocked.some(a => a.id === 'first-defense')).toBe(true);
  });

  it('unlocks Perfect Round when every decision in session of 3+ is safer', () => {
    const mockDecisions: PlayerDecision[] = [
      {
        scenarioId: 'sc-1',
        scenarioTitle: 'Test 1',
        category: 'phishing',
        optionId: 'opt-1',
        chosenText: 'Safe 1',
        safety: 'safer',
        scoreAwarded: 25,
        skillImpact: { skill: 'phishing', points: 20 },
        timestamp: Date.now(),
        timeSpentSeconds: 10,
        consequence: 'Blocked',
        securityPrinciple: 'P1'
      },
      {
        scenarioId: 'sc-2',
        scenarioTitle: 'Test 2',
        category: 'verification',
        optionId: 'opt-2',
        chosenText: 'Safe 2',
        safety: 'safer',
        scoreAwarded: 25,
        skillImpact: { skill: 'verification', points: 20 },
        timestamp: Date.now(),
        timeSpentSeconds: 10,
        consequence: 'Blocked',
        securityPrinciple: 'P2'
      },
      {
        scenarioId: 'sc-3',
        scenarioTitle: 'Test 3',
        category: 'authentication',
        optionId: 'opt-3',
        chosenText: 'Safe 3',
        safety: 'safer',
        scoreAwarded: 25,
        skillImpact: { skill: 'authentication', points: 20 },
        timestamp: Date.now(),
        timeSpentSeconds: 10,
        consequence: 'Blocked',
        securityPrinciple: 'P3'
      }
    ];

    const session: GameSession = {
      sessionId: 'TEST-PERFECT',
      mode: 'quick',
      profile: 'office',
      displayName: 'Alex',
      startTime: Date.now(),
      decisions: mockDecisions,
      totalScore: 75,
      normalizedScore: 100,
      completed: true,
      scenarioQueue: ['sc-1', 'sc-2', 'sc-3'],
      currentScenarioIndex: 2
    };

    const { updatedAchievements } = evaluateAchievements(session, [], INITIAL_ACHIEVEMENTS);
    const perfectRound = updatedAchievements.find(a => a.id === 'perfect-round');
    expect(perfectRound?.unlockedAt).toBeDefined();
  });
});
