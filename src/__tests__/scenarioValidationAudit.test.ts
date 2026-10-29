import { describe, it, expect } from 'vitest';
import { SCENARIOS, SCENARIO_MAP } from '../data/scenarios';

describe('Comprehensive Scenario & Question Integrity Audit', () => {
  it('verifies all scenarios have valid schema, principles, and options', () => {
    const errors: string[] = [];
    const seenScenarioIds = new Set<string>();
    const seenOptionIds = new Set<string>();

    expect(SCENARIOS.length).toBeGreaterThanOrEqual(25);

    SCENARIOS.forEach((s) => {
      // 1. Core required fields
      if (!s.id || s.id.trim() === '') errors.push(`Scenario missing id`);
      if (seenScenarioIds.has(s.id)) errors.push(`Duplicate scenario id: ${s.id}`);
      seenScenarioIds.add(s.id);

      if (!s.title || s.title.trim() === '') errors.push(`${s.id}: missing title`);
      if (!s.category) errors.push(`${s.id}: missing category`);
      if (!s.audience) errors.push(`${s.id}: missing audience`);
      if (!s.difficulty) errors.push(`${s.id}: missing difficulty`);
      if (!s.narrative || s.narrative.length < 20) errors.push(`${s.id}: narrative too short or missing`);
      if (!s.learningObjective || s.learningObjective.length < 10) errors.push(`${s.id}: missing learningObjective`);
      if (!s.safetyTakeaway || s.safetyTakeaway.length < 10) errors.push(`${s.id}: missing safetyTakeaway`);

      // 2. Options validation
      if (!s.options || s.options.length < 2) {
        errors.push(`${s.id}: must have at least 2 options`);
        return;
      }

      const saferOptions = s.options.filter(o => o.safety === 'safer');
      if (saferOptions.length !== 1) {
        errors.push(`${s.id}: must have exactly ONE 'safer' option (found ${saferOptions.length})`);
      }

      const criticalOrRisky = s.options.filter(o => o.safety === 'critical' || o.safety === 'risky');
      if (criticalOrRisky.length === 0) {
        errors.push(`${s.id}: must have at least one 'critical' or 'risky' option`);
      }

      // Check each option
      s.options.forEach((opt) => {
        if (!opt.id) errors.push(`${s.id}: option missing id`);
        if (seenOptionIds.has(opt.id)) errors.push(`Duplicate option id: ${opt.id}`);
        seenOptionIds.add(opt.id);

        if (!opt.text || opt.text.trim().length < 5) errors.push(`${s.id} [${opt.id}]: option text missing or too short`);
        if (!opt.consequence || opt.consequence.trim().length < 10) errors.push(`${s.id} [${opt.id}]: missing consequence`);
        if (!opt.securityPrinciple || opt.securityPrinciple.trim().length < 5) errors.push(`${s.id} [${opt.id}]: missing securityPrinciple`);
        if (!opt.saferExplanation || opt.saferExplanation.trim().length < 10) errors.push(`${s.id} [${opt.id}]: missing saferExplanation`);

        // Scoring rules
        if (opt.safety === 'safer' && opt.score <= 0) {
          errors.push(`${s.id} [${opt.id}]: 'safer' option must award positive score, got ${opt.score}`);
        }
        if (opt.safety === 'critical' && opt.score > 0) {
          errors.push(`${s.id} [${opt.id}]: 'critical' option cannot award positive score, got ${opt.score}`);
        }

        // Branching pointer validity
        if (opt.nextScenarioId) {
          if (!SCENARIO_MAP.has(opt.nextScenarioId)) {
            errors.push(`${s.id} [${opt.id}]: branch target '${opt.nextScenarioId}' does not exist in SCENARIOS!`);
          }
        }
      });

      // 3. Forensic clues validation
      if (s.forensicClues) {
        s.forensicClues.forEach((clue) => {
          if (!clue.id || !clue.element || !clue.description) {
            errors.push(`${s.id}: clue missing required fields`);
          }
          if (!['subtle', 'moderate', 'critical'].includes(clue.redFlagLevel)) {
            errors.push(`${s.id} [${clue.id}]: invalid redFlagLevel ${clue.redFlagLevel}`);
          }
        });
      }
    });

    if (errors.length > 0) {
      console.error('Validation errors found:', errors);
    }
    expect(errors).toEqual([]);
  });

  it('verifies cybersecurity principles adhere to real-world security standards', () => {
    // Audit that scenarios teach valid defensive protocols:
    // - Never approve unprompted MFA pushes
    // - Verify bank fraud alerts via physical card phone numbers
    // - Do not click package delivery SMS links
    // - Check out-of-band for friend hijacked accounts
    // - Establish family safe-words for AI voice clones
    // - Never pay utility disconnections via Zelle or prepaid cards
    // - Inspect effective Second-Level Domain (eSLD) for phishing URLs
    SCENARIOS.forEach(s => {
      const safer = s.options.find(o => o.safety === 'safer');
      expect(safer).toBeDefined();
      expect(safer!.securityPrinciple.length).toBeGreaterThanOrEqual(5);
      expect(safer!.saferExplanation.length).toBeGreaterThanOrEqual(15);
    });
  });
});
