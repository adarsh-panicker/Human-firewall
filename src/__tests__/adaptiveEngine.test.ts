import { describe, it, expect } from 'vitest';
import { buildInitialScenarioQueue, getAdaptiveNextScenario } from '../engine/adaptiveEngine';
import { PlayerDecision } from '../types/game';

describe('Adaptive Engine', () => {
  it('builds appropriate queue for each game mode', () => {
    const quick = buildInitialScenarioQueue('quick');
    expect(quick.length).toBe(3);

    const full = buildInitialScenarioQueue('full');
    expect(full.length).toBe(8);

    const demo = buildInitialScenarioQueue('demo');
    expect(demo).toEqual(['sc-mfa-1']);

    const practice = buildInitialScenarioQueue('practice', 'sc-qr-1');
    expect(practice).toEqual(['sc-qr-1']);
  });

  it('suggests targeted verification scenario when player struggles with verification', () => {
    const decisions: PlayerDecision[] = [
      {
        scenarioId: 'sc-it-call-1',
        scenarioTitle: 'IT Call',
        category: 'verification',
        optionId: 'opt-give-code',
        chosenText: 'Gave OTP',
        safety: 'critical',
        scoreAwarded: -25,
        skillImpact: { skill: 'verification', points: -20 },
        timestamp: Date.now(),
        timeSpentSeconds: 15,
        consequence: 'Account compromised',
        securityPrinciple: 'OTP safety'
      }
    ];

    const recommendation = getAdaptiveNextScenario(decisions, new Set(['sc-it-call-1']), 'office');
    expect(recommendation).toBeDefined();
    expect(recommendation.nextScenarioId).toBeDefined();
    expect(recommendation.reason).toContain('Adaptive');
  });
});
