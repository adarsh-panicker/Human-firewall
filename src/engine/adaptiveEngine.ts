import { PlayerDecision, SkillCategory, UserProfile } from '../types/game';
import { SCENARIOS } from '../data/scenarios';

export interface AdaptiveRecommendation {
  nextScenarioId: string;
  reason: string;
  adaptedSkill?: SkillCategory;
}

export function getAdaptiveNextScenario(
  decisions: PlayerDecision[],
  alreadyPlayedIds: Set<string>,
  _profile: UserProfile
): AdaptiveRecommendation {
  // Analyze weak areas in current session
  const categoryMistakes: Record<SkillCategory, number> = {
    phishing: 0,
    verification: 0,
    authentication: 0,
    privacy: 0,
    incident: 0,
    browsing: 0
  };

  decisions.forEach(d => {
    if (d.safety === 'risky' || d.safety === 'critical') {
      categoryMistakes[d.category] += d.safety === 'critical' ? 2 : 1;
    }
  });

  // Find category with highest mistakes
  const sortedWeakness = (Object.keys(categoryMistakes) as SkillCategory[])
    .sort((a, b) => categoryMistakes[b] - categoryMistakes[a]);
  const mostStruggledCategory = categoryMistakes[sortedWeakness[0]] > 0 ? sortedWeakness[0] : null;

  // If player made mistakes in a category, find an unplayed scenario in that category
  if (mostStruggledCategory) {
    const candidate = SCENARIOS.find(s => 
      !alreadyPlayedIds.has(s.id) && 
      s.category === mostStruggledCategory &&
      !s.id.startsWith('sc-mfa-') // reserve branch internals unless triggered
    );

    if (candidate) {
      return {
        nextScenarioId: candidate.id,
        reason: `Adaptive Focus: Reinforcing ${candidate.category.toUpperCase()} awareness based on your previous decisions.`,
        adaptedSkill: mostStruggledCategory
      };
    }
  }

  // If performing strongly, pick an advanced or intermediate scenario
  const advancedCandidate = SCENARIOS.find(s => 
    !alreadyPlayedIds.has(s.id) && 
    (s.difficulty === 'advanced' || s.difficulty === 'intermediate') &&
    !s.id.includes('-compromise') &&
    !s.id.includes('-investigation') &&
    !s.id.includes('-fraud') &&
    !s.id.includes('-social-eng')
  );

  if (advancedCandidate) {
    return {
      nextScenarioId: advancedCandidate.id,
      reason: 'Adaptive Escalation: Solid performance! Presenting a more nuanced, ambiguous challenge.',
      adaptedSkill: advancedCandidate.category
    };
  }

  // Fallback: any unplayed core scenario
  const fallback = SCENARIOS.find(s => 
    !alreadyPlayedIds.has(s.id) &&
    !s.id.includes('-compromise') &&
    !s.id.includes('-investigation') &&
    !s.id.includes('-fraud') &&
    !s.id.includes('-social-eng')
  );

  if (fallback) {
    return {
      nextScenarioId: fallback.id,
      reason: 'Standard Progression: Continuing core cybersecurity challenge rotation.',
      adaptedSkill: fallback.category
    };
  }

  // If all played, return safe default
  return {
    nextScenarioId: 'sc-mfa-1',
    reason: 'Challenge Complete: Reviewing baseline fundamentals.'
  };
}

export function buildInitialScenarioQueue(mode: 'quick' | 'full' | 'demo' | 'practice', targetId?: string): string[] {
  if (mode === 'demo') {
    return ['sc-mfa-1'];
  }

  if (mode === 'practice') {
    return targetId ? [targetId] : ['sc-mfa-1'];
  }

  if (mode === 'quick') {
    // 3 diverse scenarios
    return ['sc-mfa-1', 'sc-invoice-1', 'sc-qr-1'];
  }

  // Full challenge: 8 core scenarios
  return [
    'sc-mfa-1',
    'sc-invoice-1',
    'sc-qr-1',
    'sc-it-call-1',
    'sc-shared-doc-1',
    'sc-usb-drive-1',
    'sc-wifi-trap-1',
    'sc-reused-pwd-1'
  ];
}
