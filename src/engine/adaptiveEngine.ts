import { PlayerDecision, SkillCategory, UserProfile } from '../types/game';
import { SCENARIOS } from '../data/scenarios';

export interface AdaptiveRecommendation {
  nextScenarioId: string;
  reason: string;
  adaptedSkill?: SkillCategory;
}

/**
 * Filter scenarios matching the user profile audience
 */
function isAudienceMatch(audience: string, profile: UserProfile): boolean {
  if (profile === 'everyday') {
    return audience === 'everyday' || audience === 'universal';
  }
  if (profile === 'student') {
    return audience === 'everyday' || audience === 'student' || audience === 'universal';
  }
  // 'office' and 'admin' focus on workplace & business scenarios
  return audience === 'workplace' || audience === 'universal';
}

export function getAdaptiveNextScenario(
  decisions: PlayerDecision[],
  alreadyPlayedIds: Set<string>,
  profile: UserProfile = 'everyday'
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

  // Filter pool of scenarios suitable for this profile
  const profilePool = SCENARIOS.filter(s => isAudienceMatch(s.audience, profile));

  // If player made mistakes in a category, find an unplayed scenario in that category
  if (mostStruggledCategory) {
    const candidate = profilePool.find(s => 
      !alreadyPlayedIds.has(s.id) && 
      s.category === mostStruggledCategory &&
      !s.id.includes('-compromise') &&
      !s.id.includes('-investigation') &&
      !s.id.includes('-fraud') &&
      !s.id.includes('-social-eng') &&
      !s.id.includes('-verified')
    );

    if (candidate) {
      return {
        nextScenarioId: candidate.id,
        reason: `Adaptive Focus (${profile === 'everyday' ? 'Home Security' : 'Workplace'}): Reinforcing ${candidate.category.toUpperCase()} awareness based on your previous decisions.`,
        adaptedSkill: mostStruggledCategory
      };
    }
  }

  // If performing strongly, pick an advanced or intermediate scenario within the audience pool
  const advancedCandidate = profilePool.find(s => 
    !alreadyPlayedIds.has(s.id) && 
    (s.difficulty === 'advanced' || s.difficulty === 'intermediate') &&
    !s.id.includes('-compromise') &&
    !s.id.includes('-investigation') &&
    !s.id.includes('-fraud') &&
    !s.id.includes('-social-eng') &&
    !s.id.includes('-verified')
  );

  if (advancedCandidate) {
    return {
      nextScenarioId: advancedCandidate.id,
      reason: `Adaptive Escalation: Solid instincts! Presenting a more nuanced ${profile === 'everyday' ? 'real-life home' : 'workplace'} challenge.`,
      adaptedSkill: advancedCandidate.category
    };
  }

  // Fallback: any unplayed scenario in the profile pool
  const fallback = profilePool.find(s => 
    !alreadyPlayedIds.has(s.id) &&
    !s.id.includes('-compromise') &&
    !s.id.includes('-investigation') &&
    !s.id.includes('-fraud') &&
    !s.id.includes('-social-eng') &&
    !s.id.includes('-verified')
  );

  if (fallback) {
    return {
      nextScenarioId: fallback.id,
      reason: `Standard Progression: Continuing ${profile === 'everyday' ? 'home digital safety' : 'cybersecurity'} rotation.`,
      adaptedSkill: fallback.category
    };
  }

  // If all profile scenarios played, fallback to any unplayed or safe default
  const defaultId = profile === 'everyday' ? 'sc-home-delivery-1' : 'sc-mfa-1';
  return {
    nextScenarioId: defaultId,
    reason: 'Challenge Complete: Reviewing baseline fundamentals.'
  };
}

export function buildInitialScenarioQueue(
  mode: 'quick' | 'full' | 'demo' | 'practice', 
  targetId?: string,
  profile: UserProfile = 'everyday'
): string[] {
  // Practice mode: play selected scenario
  if (mode === 'practice') {
    if (targetId) return [targetId];
    return profile === 'everyday' ? ['sc-home-delivery-1'] : ['sc-mfa-1'];
  }

  // Demo mode: 1-click single scenario
  if (mode === 'demo') {
    if (profile === 'everyday') return ['sc-home-delivery-1'];
    if (profile === 'student') return ['sc-fake-job-1'];
    return ['sc-mfa-1'];
  }

  // Quick Play: 3 scenarios tailored to the profile
  if (mode === 'quick') {
    if (profile === 'everyday') {
      // 100% everyday home situations: Delivery SMS, Netflix phishing, Bank fraud call
      return ['sc-home-delivery-1', 'sc-home-netflix-1', 'sc-home-bank-sms-1'];
    }
    if (profile === 'student') {
      // Student campus life: Fake job offer, Friend hacked DM, Airport/Café Wi-Fi
      return ['sc-fake-job-1', 'sc-home-friend-hack-1', 'sc-wifi-trap-1'];
    }
    // Office / Admin: Workplace threats
    return ['sc-mfa-1', 'sc-invoice-1', 'sc-it-call-1'];
  }

  // Full Challenge: 8 core scenarios tailored to the profile
  if (profile === 'everyday') {
    // 8 everyday home scenarios that regular people actually encounter sitting at home
    return [
      'sc-home-delivery-1',     // Package delivery tracking SMS scam
      'sc-home-netflix-1',      // Streaming subscription suspended phishing email
      'sc-home-bank-sms-1',     // Bank fraud department phone call & OTP scam
      'sc-home-friend-hack-1',  // "Is this you in this video?" friend account takeover
      'sc-home-techsupport-1',  // Fullscreen "VIRUS DETECTED! Call Microsoft" popup
      'sc-home-marketplace-1',  // Facebook Marketplace fake payment / overpayment scam
      'sc-home-smart-cam-1',    // Smart home security camera default credentials
      'sc-qr-1'                 // Coffee shop table QR code swap
    ];
  }

  if (profile === 'student') {
    return [
      'sc-fake-job-1',          // Remote student assistant job recruitment scam
      'sc-home-friend-hack-1',  // Friend social media takeover link
      'sc-wifi-trap-1',         // Unsecured campus coffee shop Wi-Fi
      'sc-home-netflix-1',      // Streaming account credential harvester
      'sc-shared-doc-1',        // Shared study project Google Drive phishing
      'sc-reused-pwd-1',        // Password reused across old student forums
      'sc-home-techsupport-1',  // Browser scareware pop-up
      'sc-qr-1'                 // Campus poster QR code
    ];
  }

  // Office Professional / IT Administrator (Workplace)
  return [
    'sc-mfa-1',             // MFA fatigue push notification bomb
    'sc-invoice-1',         // Supplier invoice wire change (BEC)
    'sc-it-call-1',         // Inbound IT desk impersonator asking for OTP
    'sc-shared-doc-1',      // Encrypted executive financial spreadsheet portal
    'sc-usb-drive-1',       // Dropped USB labeled "Payroll Q3"
    'sc-wifi-trap-1',       // Airport executive lounge fake Wi-Fi
    'sc-browser-warn-1',    // Internal portal SSL certificate error
    'sc-fake-ceo-1'         // Urgent CEO WhatsApp directive
  ];
}
