import { SCENARIOS, SCENARIO_MAP } from '../data/scenarios';

export interface ValidationIssue {
  scenarioId: string;
  type: 'error' | 'warning';
  message: string;
}

export function validateAllScenarios(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  SCENARIOS.forEach(s => {
    if (!s.id) {
      issues.push({ scenarioId: 'unknown', type: 'error', message: 'Scenario has no ID' });
    }
    if (!s.title) {
      issues.push({ scenarioId: s.id, type: 'error', message: 'Scenario has no title' });
    }
    if (!s.options || s.options.length < 2) {
      issues.push({ scenarioId: s.id, type: 'error', message: 'Scenario has fewer than 2 options' });
    }

    s.options.forEach((opt, idx) => {
      if (!opt.id) {
        issues.push({ scenarioId: s.id, type: 'error', message: `Option ${idx} has no ID` });
      }
      if (!opt.text) {
        issues.push({ scenarioId: s.id, type: 'error', message: `Option ${opt.id} has no text` });
      }
      if (!opt.consequence) {
        issues.push({ scenarioId: s.id, type: 'error', message: `Option ${opt.id} has no consequence explanation` });
      }
      if (!opt.securityPrinciple) {
        issues.push({ scenarioId: s.id, type: 'error', message: `Option ${opt.id} has no security principle` });
      }
      if (!opt.saferExplanation) {
        issues.push({ scenarioId: s.id, type: 'error', message: `Option ${opt.id} has no saferExplanation` });
      }
      if (opt.nextScenarioId && !SCENARIO_MAP.has(opt.nextScenarioId)) {
        issues.push({
          scenarioId: s.id,
          type: 'error',
          message: `Option ${opt.id} references non-existent nextScenarioId: ${opt.nextScenarioId}`
        });
      }
    });
  });

  return issues;
}
