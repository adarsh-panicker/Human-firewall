import { PlayerDecision, SkillCategory } from '../types/game';

export interface ScoreReport {
  rawScore: number;
  maxPossibleScore: number;
  normalizedScore: number; // 0 - 100
  decisionsCount: number;
  saferCount: number;
  riskyCount: number;
  criticalCount: number;
  partialCount: number;
  categoryScores: Record<SkillCategory, {
    earned: number;
    maxPossible: number;
    percentage: number;
    decisionCount: number;
  }>;
  strongestSkill: SkillCategory | null;
  weakestSkill: SkillCategory | null;
}

const DEFAULT_CATEGORIES: SkillCategory[] = [
  'phishing',
  'verification',
  'authentication',
  'privacy',
  'incident',
  'browsing'
];

export function calculateSessionScore(decisions: PlayerDecision[]): ScoreReport {
  const categoryScores: Record<SkillCategory, { earned: number; maxPossible: number; percentage: number; decisionCount: number }> = {
    phishing: { earned: 0, maxPossible: 0, percentage: 0, decisionCount: 0 },
    verification: { earned: 0, maxPossible: 0, percentage: 0, decisionCount: 0 },
    authentication: { earned: 0, maxPossible: 0, percentage: 0, decisionCount: 0 },
    privacy: { earned: 0, maxPossible: 0, percentage: 0, decisionCount: 0 },
    incident: { earned: 0, maxPossible: 0, percentage: 0, decisionCount: 0 },
    browsing: { earned: 0, maxPossible: 0, percentage: 0, decisionCount: 0 },
  };

  let rawScore = 0;
  let maxPossibleScore = 0;
  let saferCount = 0;
  let riskyCount = 0;
  let criticalCount = 0;
  let partialCount = 0;

  decisions.forEach(decision => {
    // Standard safest option awards 25 points
    const potentialMax = 25;
    const awarded = Math.max(0, decision.scoreAwarded);

    rawScore += decision.scoreAwarded;
    maxPossibleScore += potentialMax;

    if (decision.safety === 'safer') saferCount++;
    else if (decision.safety === 'risky') riskyCount++;
    else if (decision.safety === 'critical') criticalCount++;
    else if (decision.safety === 'partial') partialCount++;

    const cat = decision.category;
    if (categoryScores[cat]) {
      categoryScores[cat].earned += awarded;
      categoryScores[cat].maxPossible += potentialMax;
      categoryScores[cat].decisionCount++;
    }
  });

  // Calculate percentages for categories with decisions
  DEFAULT_CATEGORIES.forEach(cat => {
    const entry = categoryScores[cat];
    if (entry.maxPossible > 0) {
      entry.percentage = Math.round((Math.max(0, entry.earned) / entry.maxPossible) * 100);
    } else {
      entry.percentage = 100; // Uncontested default
    }
  });

  // Normalized overall score from 0 to 100
  let normalizedScore = 0;
  if (maxPossibleScore > 0) {
    normalizedScore = Math.min(100, Math.max(0, Math.round((rawScore / maxPossibleScore) * 100)));
  }

  // Find strongest and weakest skills among categories that were actually tested
  const testedCategories = DEFAULT_CATEGORIES.filter(c => categoryScores[c].decisionCount > 0);
  
  let strongestSkill: SkillCategory | null = null;
  let weakestSkill: SkillCategory | null = null;

  if (testedCategories.length > 0) {
    testedCategories.sort((a, b) => categoryScores[b].percentage - categoryScores[a].percentage);
    strongestSkill = testedCategories[0];
    weakestSkill = testedCategories[testedCategories.length - 1];
  }

  return {
    rawScore,
    maxPossibleScore,
    normalizedScore,
    decisionsCount: decisions.length,
    saferCount,
    riskyCount,
    criticalCount,
    partialCount,
    categoryScores,
    strongestSkill,
    weakestSkill
  };
}

export const SKILL_LABELS: Record<SkillCategory, string> = {
  phishing: 'Phishing Recognition',
  verification: 'Identity Verification',
  authentication: 'Authentication Safety',
  privacy: 'Privacy & Data Handling',
  incident: 'Incident Response',
  browsing: 'Safe Browsing'
};

export const SKILL_COLORS: Record<SkillCategory, { text: string; bg: string; border: string }> = {
  phishing: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  verification: { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  authentication: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  privacy: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  incident: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  browsing: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
};
