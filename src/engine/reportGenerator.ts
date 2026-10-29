import { GameSession, SkillCategory } from '../types/game';
import { ScoreReport, SKILL_LABELS } from './scoringEngine';

export interface ActionableRecommendation {
  id: string;
  category: SkillCategory;
  title: string;
  action: string;
  whyItMatters: string;
}

export interface PersonalizedReportData {
  scoreReport: ScoreReport;
  summaryText: string;
  strongestSkillLabel: string;
  weakestSkillLabel: string;
  recommendations: ActionableRecommendation[];
  historyComparison: {
    hasHistory: boolean;
    difference: number;
    text: string;
  };
}

const RECOMMENDATION_CATALOG: Record<SkillCategory, ActionableRecommendation> = {
  phishing: {
    id: 'rec-phishing',
    category: 'phishing',
    title: 'Inspect Domains & Headers Out-of-Band',
    action: 'Always look past the display name to check the exact root domain in email headers and QR URLs before entering credentials or clicking links.',
    whyItMatters: 'Over 85% of credential breaches begin with visually convincing lookalike domains and impersonated branding.'
  },
  verification: {
    id: 'rec-verification',
    category: 'verification',
    title: 'Establish Independent Callback Channels',
    action: 'When receiving urgent financial, password, or code requests via chat/phone, hang up and dial the sender\'s verified internal directory number.',
    whyItMatters: 'Caller ID and chat profiles can be spoofed in seconds; out-of-band callback is the only definitive identity proof.'
  },
  authentication: {
    id: 'rec-auth',
    category: 'authentication',
    title: 'Adopt Passkeys & Stop MFA Fatigue',
    action: 'Never approve an MFA push notification that you did not personally trigger. Migrate critical accounts to FIDO2 passkeys or authenticator apps.',
    whyItMatters: 'MFA fatigue attacks rely on weary users approving prompts to clear annoying notifications, handing attackers full access.'
  },
  privacy: {
    id: 'rec-privacy',
    category: 'privacy',
    title: 'Verify Before Exposing Personal or Company Data',
    action: 'Never submit government IDs, passport copies, or employee spreadsheets without verified, secure enterprise portals and legal justification.',
    whyItMatters: 'Leaked identity documents facilitate synthetic identity theft and expose organizations to severe regulatory liability.'
  },
  incident: {
    id: 'rec-incident',
    category: 'incident',
    title: 'Contain Immediately & Report Transparently',
    action: 'If an error occurs (such as approving a prompt or sending data to the wrong person), revoke active sessions and notify security immediately.',
    whyItMatters: 'Speed of containment separates minor security incidents from catastrophic corporate data breaches.'
  },
  browsing: {
    id: 'rec-browsing',
    category: 'browsing',
    title: 'Honor TLS Warnings & Use Encrypted Tunnels',
    action: 'Never click through "Proceed Anyway (unsafe)" browser warnings or install unvetted Wi-Fi profiles on public networks. Use your mobile hotspot.',
    whyItMatters: 'Certificate warnings indicate active man-in-the-middle decryption attempts on untrusted public gateways.'
  }
};

export function generatePersonalizedReport(
  session: GameSession,
  scoreReport: ScoreReport,
  history: GameSession[]
): PersonalizedReportData {
  const strongestSkillLabel = scoreReport.strongestSkill
    ? SKILL_LABELS[scoreReport.strongestSkill]
    : 'General Security Awareness';

  const weakestSkillLabel = scoreReport.weakestSkill
    ? SKILL_LABELS[scoreReport.weakestSkill]
    : 'Consistent Execution';

  // Generate 3 actionable recommendations based on actual mistakes
  const recList: ActionableRecommendation[] = [];

  // 1. Weakest skill recommendation
  if (scoreReport.weakestSkill && RECOMMENDATION_CATALOG[scoreReport.weakestSkill]) {
    recList.push(RECOMMENDATION_CATALOG[scoreReport.weakestSkill]);
  }

  // 2. Critical mistakes category recommendation
  const criticalDecision = session.decisions.find(d => d.safety === 'critical');
  if (criticalDecision && RECOMMENDATION_CATALOG[criticalDecision.category]) {
    const criticalRec = RECOMMENDATION_CATALOG[criticalDecision.category];
    if (!recList.some(r => r.id === criticalRec.id)) {
      recList.push(criticalRec);
    }
  }

  // 3. Fill remaining slots with priority categories
  const categoriesToFill: SkillCategory[] = ['verification', 'authentication', 'phishing', 'incident', 'browsing', 'privacy'];
  for (const cat of categoriesToFill) {
    if (recList.length >= 3) break;
    const item = RECOMMENDATION_CATALOG[cat];
    if (!recList.some(r => r.id === item.id)) {
      recList.push(item);
    }
  }

  // History comparison
  const priorSessions = history.filter(s => s.sessionId !== session.sessionId && s.completed);
  let historyComparison = {
    hasHistory: false,
    difference: 0,
    text: 'This is your baseline session. Keep playing to track your improvement over time!'
  };

  if (priorSessions.length > 0) {
    const lastSession = priorSessions[priorSessions.length - 1];
    const diff = session.normalizedScore - lastSession.normalizedScore;
    historyComparison = {
      hasHistory: true,
      difference: diff,
      text: diff > 0
        ? `+${diff} points improvement compared to your previous challenge! Your defensive reflexes are sharpening.`
        : diff === 0
        ? 'Matched your previous score. Consistent vigilance is key to cybersecurity.'
        : `${diff} points compared to your previous run. Review your risky decisions below to reinforce safer digital habits.`
    };
  }

  // Concise personalized learning summary
  let summaryText = '';
  if (scoreReport.normalizedScore >= 90) {
    summaryText = `Exceptional vigilance! You demonstrated rock-solid defensive instincts, particularly in ${strongestSkillLabel}. You consistently verified sender identities and rejected high-pressure social engineering tactics.`;
  } else if (scoreReport.normalizedScore >= 70) {
    summaryText = `Strong cybersecurity instincts with high awareness in ${strongestSkillLabel}. By tightening up your procedures in ${weakestSkillLabel}, you will become an impenetrable human firewall.`;
  } else if (scoreReport.normalizedScore >= 50) {
    summaryText = `Good foundational awareness, but you encountered realistic traps where emotional urgency or deceptive branding bypassed verification. Focus on out-of-band checks in ${weakestSkillLabel}.`;
  } else {
    summaryText = `Valuable learning round! Several realistic traps led to simulated compromises. Every mistake is an opportunity: review the explanations below to build resilient digital habits.`;
  }

  return {
    scoreReport,
    summaryText,
    strongestSkillLabel,
    weakestSkillLabel,
    recommendations: recList.slice(0, 3),
    historyComparison
  };
}
