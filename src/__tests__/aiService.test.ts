import { describe, it, expect } from 'vitest';
import { analyzeThreat, generatePlayableScenario, askSecurityCopilot } from '../services/aiService';

describe('AI Cyber Copilot & Forensic Service', () => {
  it('analyzes suspicious smishing text with offline heuristic engine', async () => {
    const text = 'USPS: Package delayed. Pay $1.95 redelivery fee at https://usps-redelivery.top immediately';
    const result = await analyzeThreat(text);

    expect(result).toBeDefined();
    expect(result.threatLevel).toBe('Severe');
    expect(result.identifiedRedFlags.length).toBeGreaterThan(0);
    expect(result.psychologicalTriggers.length).toBeGreaterThan(0);
    expect(result.safeActionRecommendation).toContain('Do not click');
  });

  it('generates a valid playable scenario offline', async () => {
    const scenario = await generatePlayableScenario('Urgent Hospital Bill SMS', 'everyday');

    expect(scenario).toBeDefined();
    expect(scenario.id).toContain('sc-synth-offline-');
    expect(scenario.title).toBeDefined();
    expect(scenario.options.length).toBeGreaterThanOrEqual(2);
    expect(scenario.forensicClues?.length).toBeGreaterThanOrEqual(1);
    expect(scenario.learningObjective).toBeDefined();
  });

  it('provides educational cyber mentor debriefs', async () => {
    const answer = await askSecurityCopilot('How do AI voice clones work in bail scams?');

    expect(answer).toBeDefined();
    expect(answer.length).toBeGreaterThan(50);
    expect(answer.toLowerCase()).toContain('safe-word');
  });
});
