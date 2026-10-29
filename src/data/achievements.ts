import { Achievement } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-defense',
    title: 'First Line of Defense',
    description: 'Complete your first security challenge round.',
    icon: 'ShieldCheck',
    category: 'milestone'
  },
  {
    id: 'verify-first',
    title: 'Verify First',
    description: 'Correctly handle three identity-verification or out-of-band checks.',
    icon: 'UserCheck',
    category: 'skill'
  },
  {
    id: 'phishing-spotter',
    title: 'Phishing Spotter',
    description: 'Make consistently safe choices in email, QR, and browser phishing scenarios.',
    icon: 'MailCheck',
    category: 'skill'
  },
  {
    id: 'incident-responder',
    title: 'Incident Responder',
    description: 'Choose appropriate containment and reporting actions during an active incident.',
    icon: 'AlertTriangle',
    category: 'recovery'
  },
  {
    id: 'perfect-round',
    title: 'Perfect Round',
    description: 'Make the safest decision in every single scenario in a challenge session.',
    icon: 'Award',
    category: 'mastery'
  },
  {
    id: 'learning-progress',
    title: 'Learning in Progress',
    description: 'Improve your learning score on a subsequent attempt.',
    icon: 'TrendingUp',
    category: 'milestone'
  },
  {
    id: 'zero-trust',
    title: 'Zero Trust Champion',
    description: 'Finish a Full Challenge with a learning score of 85 or higher.',
    icon: 'ShieldAlert',
    category: 'mastery'
  },
  {
    id: 'safe-recovery',
    title: 'Crisis Containment Specialist',
    description: 'Successfully navigate a branching incident recovery path.',
    icon: 'RefreshCw',
    category: 'recovery'
  }
];
