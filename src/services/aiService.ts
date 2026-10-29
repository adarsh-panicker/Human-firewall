import { Scenario, ScenarioAudience, SkillCategory } from '../types/game';

export interface ThreatAnalysisResult {
  threatLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  scamType: string;
  psychologicalTriggers: string[];
  identifiedRedFlags: string[];
  safeActionRecommendation: string;
  technicalExplanation: string;
}

/**
 * 100% Offline Heuristic Threat Analyzer (Zero Network, Zero External API Keys)
 * Fully compliant with SafeSpace Hacks 2026 rules.
 */
export function analyzeThreat(text: string): ThreatAnalysisResult {
  const lower = text.toLowerCase();
  const redFlags: string[] = [];
  const triggers: string[] = [];
  let score = 0;

  // Check urgency
  if (/urgent|immediately|within \d+|suspended|terminated|dispatched|45 min|right now|hurry|final notice/i.test(text)) {
    triggers.push('Artificial Urgency (Fear of Missing Out / Immediate Penalty)');
    redFlags.push('High-pressure deadline designed to bypass rational skepticism');
    score += 30;
  }

  // Check financial demands / methods
  if (/gift card|bitcoin|crypto|zelle|cashapp|venmo|wire transfer|atm|prepaid|vanilla visa|western union/i.test(text)) {
    triggers.push('Irreversible / Unregulated Payment Channels');
    redFlags.push('Requests payment via untraceable non-reputable methods (Crypto/Gift cards/Zelle)');
    score += 40;
  }

  // Check credential harvesting
  if (/password|passcode|one-time code|otp|6-digit|verify your account|log in to view|ssn|social security/i.test(text)) {
    triggers.push('Credential / Identity Harvesting');
    redFlags.push('Requests sensitive authentication credentials or one-time passcodes');
    score += 35;
  }

  // Check authority/impersonation
  if (/police|officer|fbi|irs|usps|geek squad|microsoft|apple|netflix|bank|sheriff|customs/i.test(text)) {
    triggers.push('Authority Impersonation');
    redFlags.push('Claims to represent government, law enforcement, or trusted tech platform');
    score += 25;
  }

  // Check suspicious links
  if (/http:\/\/|\.top|\.online|\.cc|\.xyz|\.click|\.tk|bit\.ly|tinyurl|t\.me/i.test(text)) {
    triggers.push('Deceptive Infrastructure');
    redFlags.push('Contains suspicious top-level domain (.top/.online/.xyz) or unencrypted protocol');
    score += 30;
  }

  // Check secrecy
  if (/don't tell|keep this confidential|private matter|secret|do not call/i.test(text)) {
    triggers.push('Forced Isolation / Secrecy');
    redFlags.push('Instructs victim not to consult family, colleagues, or authorities');
    score += 25;
  }

  let threatLevel: ThreatAnalysisResult['threatLevel'] = 'Low';
  if (score >= 60) threatLevel = 'Severe';
  else if (score >= 40) threatLevel = 'High';
  else if (score >= 20) threatLevel = 'Medium';

  let scamType = 'Generic Suspicious Communication';
  if (lower.includes('geek squad') || lower.includes('refund') || lower.includes('auto-renewal')) {
    scamType = 'Tech Support / Refund Social Engineering Scam';
  } else if (lower.includes('usps') || lower.includes('package') || lower.includes('delivery')) {
    scamType = 'Smishing (Postal / Delivery Impersonation)';
  } else if (lower.includes('bail') || lower.includes('arrested') || lower.includes('accident')) {
    scamType = 'Emergency Family Extortion / Voice Clone Scam';
  } else if (lower.includes('zelle') || lower.includes('bank') || lower.includes('fraud department')) {
    scamType = 'Bank Vishing & Reverse-OTP Hijack';
  } else if (lower.includes('netflix') || lower.includes('billing') || lower.includes('account suspended')) {
    scamType = 'Subscription Credential Harvester Phishing';
  } else if (lower.includes('chloe') || lower.includes('wrong number') || lower.includes('tennis')) {
    scamType = 'Pig Butchering (Sha Zhu Pan) Long-Con Romance/Crypto Scam';
  }

  return {
    threatLevel,
    scamType,
    psychologicalTriggers: triggers.length > 0 ? triggers : ['Curiosity', 'Informal Social Engagement'],
    identifiedRedFlags: redFlags.length > 0 ? redFlags : ['Unverified sender identity', 'Unsolicited inbound communication'],
    safeActionRecommendation: 'Do not click links, do not reply to the message, and never authorize remote access or send funds. Independently verify by contacting the alleged organization using official public records.',
    technicalExplanation: `The communication exhibits pattern match indicators characteristic of modern social engineering funnels. The attacker attempts to manipulate cognitive emotional biases before the victim can apply critical verification protocols.`
  };
}

/**
 * 100% Offline Scenario Synthesis Engine
 */
export function generatePlayableScenario(
  topic: string, 
  audience: ScenarioAudience = 'everyday'
): Scenario {
  const safeTopic = topic.trim() || 'Suspicious Account Verification Alert';
  const category: SkillCategory = audience === 'everyday' ? 'verification' : 'phishing';

  return {
    id: `sc-synth-offline-${Date.now()}`,
    title: `Forensic Simulation: ${safeTopic.slice(0, 45)}`,
    category,
    audience,
    difficulty: 'intermediate',
    estimatedReadingSec: 20,
    narrative: `You receive an unexpected digital notification regarding "${safeTopic}". The message insists that immediate verification is required within 15 minutes to prevent account restriction or financial forfeiture.`,
    simulatedType: 'sms',
    simulatedData: {
      smsSender: 'SECURITY-ALERT',
      smsBody: `ACTION REQUIRED regarding "${safeTopic}": Verify identity immediately at https://secure-verification-portal.online/auth`,
      carrierWarning: 'Unverified Origin'
    },
    learningObjective: `Verify unexpected notices regarding ${safeTopic} through trusted independent channels.`,
    safetyTakeaway: 'Never click verification links or share authorization codes based on inbound high-urgency notifications.',
    forensicClues: [
      {
        id: 'clue-synth-urgency',
        element: 'High urgency 15-minute deadline',
        description: 'Attackers create artificial time constraints to prevent you from researching or verifying.',
        redFlagLevel: 'critical'
      },
      {
        id: 'clue-synth-domain',
        element: 'Domain: secure-verification-portal.online',
        description: 'Generic TLD (.online) registered recently to mimic authentic corporate sign-in portals.',
        redFlagLevel: 'critical'
      }
    ],
    options: [
      {
        id: 'synth-opt-verify-independently',
        text: 'Do not click the link. Log into the authentic official app or website directly from your saved bookmarks.',
        safety: 'safer',
        score: 25,
        skillImpact: { skill: category, points: 25 },
        consequence: 'Your official account dashboard shows everything is in good standing. You safely bypassed the trap.',
        securityPrinciple: 'Independent Out-of-Band Verification',
        saferExplanation: 'Navigating independently through trusted bookmarks completely neutralizes phishing and credential harvesters.'
      },
      {
        id: 'synth-opt-click-link',
        text: 'Click the link and enter your credentials quickly to avoid having your account suspended.',
        safety: 'critical',
        score: -25,
        skillImpact: { skill: category, points: -25 },
        consequence: 'The malicious site captures your password and session tokens, giving criminals unauthorized access.',
        securityPrinciple: 'Credential Harvester Exploitation',
        saferExplanation: 'Phishing websites are designed to look identical to authentic brand portals to harvest credentials.'
      },
      {
        id: 'synth-opt-reply-message',
        text: 'Reply to the alert asking: "Is this genuine? What information do you need?"',
        safety: 'risky',
        score: 5,
        skillImpact: { skill: category, points: 0 },
        consequence: 'The sender uses automated social engineering chatbots to escalate the pressure.',
        securityPrinciple: 'Untrusted Inbound Interaction Risk',
        saferExplanation: 'Replying confirms your contact details are actively monitored by a responsive human.'
      }
    ]
  };
}

/**
 * 100% Offline Cyber Mentor Knowledge Base
 */
export function askSecurityCopilot(
  question: string,
  _contextScenarioTitle?: string
): string {
  const q = question.toLowerCase();

  if (q.includes('voice') || q.includes('clone') || q.includes('bail') || q.includes('kidnap')) {
    return `**AI Voice Cloning Defense:**\n\nModern generative AI voice models can synthesize a convincing clone of anyone's voice using as little as 3 seconds of clean audio extracted from public TikTok, Instagram, or YouTube videos.\n\n**The Golden Rule:** Always establish a private **"Family Emergency Safe-Word"** in advance that only your closest family members know. If someone calls claiming an emergency, ask for the safe-word. If they cannot provide it, hang up immediately and dial the family member directly on their known personal phone number.`;
  }

  if (q.includes('gift card') || q.includes('bitcoin') || q.includes('crypto') || q.includes('zelle')) {
    return `**Why Scammers Demand Gift Cards & Crypto:**\n\nCredit cards and traditional bank transfers have federally mandated fraud protections (Regulation E) that allow banks to claw back stolen funds within days. Cryptocurrency and gift cards, however, are **cryptographically irreversible and non-custodial**.\n\nOnce a gift card code is sent or Bitcoin is transferred, the money is liquid and untraceable within seconds. **No legitimate company, court, or government agency will EVER demand payment via gift cards or Bitcoin ATMs.**`;
  }

  if (q.includes('delivery') || q.includes('usps') || q.includes('package') || q.includes('fedex')) {
    return `**Postal & Package Smishing Anatomy:**\n\nScammers send millions of automated text messages claiming a package is delayed or requires a small redelivery fee ($1.50–$3.00). The tiny fee is psychological bait: victims don't hesitate to pay $2, but entering credit card details hands full card numbers, CVVs, and billing addresses directly to credit card fraud rings.\n\n**Best Defense:** Never click delivery SMS links. If you're expecting a package, open the official USPS, FedEx, or UPS app and type the tracking number directly into the search bar.`;
  }

  return `**Cyber Defense Principle:**\n\nSocial engineering attacks succeed not because victims are foolish, but because attackers exploit fundamental human traits: empathy, authority respect, fear, and curiosity.\n\n**The 3-Second Pause Rule:**\n1. **Stop & Breathe:** When an alert induces panic or extreme urgency, recognize that emotional agitation IS the weapon.\n2. **Break the Channel:** Never verify an alert through the phone number, email address, or link sent inside the alert itself.\n3. **Use Out-of-Band Channels:** Go to your browser, type the official website domain manually, or call the number physically printed on the back of your card.`;
}
