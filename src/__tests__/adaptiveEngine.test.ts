import { describe, it, expect } from 'vitest';
import { buildInitialScenarioQueue, getAdaptiveNextScenario } from '../engine/adaptiveEngine';
import { PlayerDecision } from '../types/game';

describe('Adaptive Engine', () => {
  it('builds appropriate queue for everyday home users', () => {
    const quick = buildInitialScenarioQueue('quick', undefined, 'everyday');
    expect(quick.length).toBe(3);
    expect(quick).toEqual(['sc-home-delivery-1', 'sc-home-netflix-1', 'sc-home-bank-sms-1']);

    const full = buildInitialScenarioQueue('full', undefined, 'everyday');
    expect(full.length).toBe(8);
    // Everyday scenarios only (no corporate invoice or IT push bomb)
    expect(full[0]).toBe('sc-home-delivery-1');
    expect(full[1]).toBe('sc-home-netflix-1');

    const demo = buildInitialScenarioQueue('demo', undefined, 'everyday');
    expect(demo).toEqual(['sc-home-delivery-1']);

    const practice = buildInitialScenarioQueue('practice', 'sc-qr-1', 'everyday');
    expect(practice).toEqual(['sc-qr-1']);
  });

  it('builds appropriate queue for office/admin workplace users', () => {
    const quick = buildInitialScenarioQueue('quick', undefined, 'office');
    expect(quick.length).toBe(3);
    expect(quick).toEqual(['sc-mfa-1', 'sc-invoice-1', 'sc-it-call-1']);

    const full = buildInitialScenarioQueue('full', undefined, 'office');
    expect(full.length).toBe(8);
    expect(full[0]).toBe('sc-mfa-1');

    const demo = buildInitialScenarioQueue('demo', undefined, 'office');
    expect(demo).toEqual(['sc-mfa-1']);
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
