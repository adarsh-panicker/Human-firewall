import { describe, it, expect } from 'vitest';
import { resolveNextStep } from '../engine/branchingEngine';
import { SCENARIO_MAP } from '../data/scenarios';
import { DecisionOption } from '../types/game';

describe('Branching Engine', () => {
  const mfaScenario = SCENARIO_MAP.get('sc-mfa-1')!;

  it('inserts branch scenario immediately when chosen option specifies nextScenarioId', () => {
    const approveOption = mfaScenario.options.find(o => o.id === 'mfa-opt-approve')!;
    const initialQueue = ['sc-mfa-1', 'sc-invoice-1', 'sc-qr-1'];

    const result = resolveNextStep(mfaScenario, approveOption, initialQueue, 0);

    expect(result.isBranchingJump).toBe(true);
    expect(result.nextScenarioId).toBe('sc-mfa-compromise');
    expect(result.isChallengeComplete).toBe(false);
    expect(result.updatedQueue[1]).toBe('sc-mfa-compromise');
    expect(result.newIndex).toBe(1);
  });

  it('advances sequentially down queue when option does not specify branch target', () => {
    const standardOption: DecisionOption = {
      id: 'opt-standard',
      text: 'Standard Choice',
      safety: 'safer',
      score: 25,
      skillImpact: { skill: 'phishing', points: 20 },
      consequence: 'No branch',
      securityPrinciple: 'Standard',
      saferExplanation: 'Expl'
    };

    const initialQueue = ['sc-mfa-1', 'sc-invoice-1', 'sc-qr-1'];
    const result = resolveNextStep(mfaScenario, standardOption, initialQueue, 0);

    expect(result.isBranchingJump).toBe(false);
    expect(result.nextScenarioId).toBe('sc-invoice-1');
    expect(result.isChallengeComplete).toBe(false);
    expect(result.newIndex).toBe(1);
  });

  it('flags challenge completion when the final queue scenario is finished', () => {
    const standardOption: DecisionOption = {
      id: 'opt-standard',
      text: 'Standard Choice',
      safety: 'safer',
      score: 25,
      skillImpact: { skill: 'phishing', points: 20 },
      consequence: 'No branch',
      securityPrinciple: 'Standard',
      saferExplanation: 'Expl'
    };

    const singleItemQueue = ['sc-mfa-1'];
    const result = resolveNextStep(mfaScenario, standardOption, singleItemQueue, 0);

    expect(result.isChallengeComplete).toBe(true);
    expect(result.nextScenarioId).toBeNull();
  });
});
