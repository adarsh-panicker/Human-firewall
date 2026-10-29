import { describe, it, expect } from 'vitest';
import { calculateSessionScore } from '../engine/scoringEngine';
import { PlayerDecision } from '../types/game';

describe('Scoring Engine', () => {
  it('returns score 0 when decisions list is empty', () => {
    const result = calculateSessionScore([]);
    expect(result.rawScore).toBe(0);
    expect(result.maxPossibleScore).toBe(0);
    expect(result.normalizedScore).toBe(0);
    expect(result.decisionsCount).toBe(0);
  });

  it('calculates 100% normalized score when all decisions are safer', () => {
    const mockDecisions: PlayerDecision[] = [
      {
        scenarioId: 'sc-1',
        scenarioTitle: 'Test 1',
        category: 'phishing',
        optionId: 'opt-1',
        chosenText: 'Verify callback',
        safety: 'safer',
        scoreAwarded: 25,
        skillImpact: { skill: 'phishing', points: 20 },
        timestamp: Date.now(),
        timeSpentSeconds: 15,
        consequence: 'Blocked attack',
        securityPrinciple: 'Verification'
      },
      {
        scenarioId: 'sc-2',
        scenarioTitle: 'Test 2',
        category: 'authentication',
        optionId: 'opt-2',
        chosenText: 'Deny prompt',
        safety: 'safer',
        scoreAwarded: 25,
        skillImpact: { skill: 'authentication', points: 20 },
        timestamp: Date.now(),
        timeSpentSeconds: 12,
        consequence: 'Protected account',
        securityPrinciple: 'MFA hygiene'
      }
    ];

    const result = calculateSessionScore(mockDecisions);
    expect(result.rawScore).toBe(50);
    expect(result.maxPossibleScore).toBe(50);
    expect(result.normalizedScore).toBe(100);
    expect(result.saferCount).toBe(2);
    expect(result.riskyCount).toBe(0);
    expect(result.criticalCount).toBe(0);
  });

  it('normalizes score to 0 when all decisions are critical negatives', () => {
    const mockDecisions: PlayerDecision[] = [
      {
        scenarioId: 'sc-1',
        scenarioTitle: 'Test 1',
        category: 'phishing',
        optionId: 'opt-1',
        chosenText: 'Wire money immediately',
        safety: 'critical',
        scoreAwarded: -25,
        skillImpact: { skill: 'phishing', points: -20 },
        timestamp: Date.now(),
        timeSpentSeconds: 5,
        consequence: 'Funds lost',
        securityPrinciple: 'BEC'
      }
    ];

    const result = calculateSessionScore(mockDecisions);
    expect(result.rawScore).toBe(-25);
    expect(result.normalizedScore).toBe(0);
    expect(result.criticalCount).toBe(1);
  });

  it('correctly identifies strongest and weakest skills', () => {
    const mockDecisions: PlayerDecision[] = [
      {
        scenarioId: 'sc-1',
        scenarioTitle: 'Phishing safe',
        category: 'phishing',
        optionId: 'opt-1',
        chosenText: 'Safe',
        safety: 'safer',
        scoreAwarded: 25,
        skillImpact: { skill: 'phishing', points: 20 },
        timestamp: Date.now(),
        timeSpentSeconds: 10,
        consequence: 'Safe',
        securityPrinciple: 'Phishing'
      },
      {
        scenarioId: 'sc-2',
        scenarioTitle: 'Verification fail',
        category: 'verification',
        optionId: 'opt-2',
        chosenText: 'Unsafe',
        safety: 'critical',
        scoreAwarded: -20,
        skillImpact: { skill: 'verification', points: -20 },
        timestamp: Date.now(),
        timeSpentSeconds: 10,
        consequence: 'Failed',
        securityPrinciple: 'Vishing'
      }
    ];

    const result = calculateSessionScore(mockDecisions);
    expect(result.strongestSkill).toBe('phishing');
    expect(result.weakestSkill).toBe('verification');
    expect(result.categoryScores.phishing.percentage).toBe(100);
    expect(result.categoryScores.verification.percentage).toBe(0);
  });
});
