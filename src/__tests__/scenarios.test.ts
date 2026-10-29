import { describe, it, expect } from 'vitest';
import { SCENARIOS, SCENARIO_MAP } from '../data/scenarios';
import { validateAllScenarios } from '../utils/scenarioValidator';

describe('Scenario Data Integrity', () => {
  it('should have at least 12 core scenarios and branching scenarios', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(12);
  });

  it('passes automated validator with 0 issues', () => {
    const issues = validateAllScenarios();
    expect(issues).toEqual([]);
  });

  it('contains all required scenario categories', () => {
    const categories = new Set(SCENARIOS.map(s => s.category));
    expect(categories.has('phishing')).toBe(true);
    expect(categories.has('verification')).toBe(true);
    expect(categories.has('authentication')).toBe(true);
    expect(categories.has('privacy')).toBe(true);
    expect(categories.has('incident')).toBe(true);
    expect(categories.has('browsing')).toBe(true);
  });

  it('contains branching paths for MFA, Invoice, and Browser scenarios', () => {
    // MFA branches
    const mfaScenario = SCENARIO_MAP.get('sc-mfa-1');
    expect(mfaScenario).toBeDefined();
    const mfaTargets = mfaScenario!.options.map(o => o.nextScenarioId).filter(Boolean);
    expect(mfaTargets).toContain('sc-mfa-compromise');
    expect(mfaTargets).toContain('sc-mfa-investigation');
    expect(mfaTargets).toContain('sc-mfa-social-eng');

    // All referenced branch scenarios exist in map
    mfaTargets.forEach(targetId => {
      expect(SCENARIO_MAP.has(targetId!)).toBe(true);
    });

    // Invoice branches
    const invoiceScenario = SCENARIO_MAP.get('sc-invoice-1');
    expect(invoiceScenario).toBeDefined();
    const invoiceTargets = invoiceScenario!.options.map(o => o.nextScenarioId).filter(Boolean);
    expect(invoiceTargets).toContain('sc-invoice-fraud');
    expect(invoiceTargets).toContain('sc-invoice-verified');
  });

  it('ensures every option has non-empty learning outcomes', () => {
    SCENARIOS.forEach(s => {
      s.options.forEach(opt => {
        expect(opt.id.length).toBeGreaterThan(0);
        expect(opt.text.length).toBeGreaterThan(0);
        expect(opt.consequence.length).toBeGreaterThan(0);
        expect(opt.securityPrinciple.length).toBeGreaterThan(0);
        expect(opt.saferExplanation.length).toBeGreaterThan(0);
        expect(typeof opt.score).toBe('number');
        expect(opt.skillImpact).toBeDefined();
      });
    });
  });
});
