export type UserProfile = 'everyday' | 'student' | 'office' | 'admin';

export type GameMode = 'quick' | 'full' | 'practice' | 'demo';

export type SkillCategory = 
  | 'phishing' 
  | 'verification' 
  | 'authentication' 
  | 'privacy' 
  | 'incident' 
  | 'browsing';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type DecisionSafety = 'safer' | 'risky' | 'critical' | 'partial';

export interface DecisionOption {
  id: string;
  text: string;
  safety: DecisionSafety;
  score: number; // e.g. -15 to +25
  skillImpact: {
    skill: SkillCategory;
    points: number;
  };
  consequence: string;
  securityPrinciple: string;
  saferExplanation: string;
  nextScenarioId?: string; // explicit branch target
  isRecovery?: boolean;
}

export type SimulatedType = 
  | 'mfa'
  | 'email'
  | 'qr'
  | 'chat'
  | 'call'
  | 'usb'
  | 'wifi'
  | 'password'
  | 'job'
  | 'browser'
  | 'datasheet'
  | 'sms';

export interface ForensicClue {
  id: string;
  element: string;
  description: string;
  redFlagLevel: 'subtle' | 'moderate' | 'critical';
}

export type ScenarioAudience = 'everyday' | 'workplace' | 'student' | 'universal';

export interface Scenario {
  id: string;
  title: string;
  category: SkillCategory;
  audience: ScenarioAudience;
  difficulty: DifficultyLevel;
  estimatedReadingSec: number;
  narrative: string;
  simulatedType: SimulatedType;
  simulatedData: Record<string, any>;
  options: DecisionOption[];
  learningObjective: string;
  safetyTakeaway: string;
  branchingFollowupIds?: string[];
  adaptiveTags?: string[];
  profileFlavor?: Partial<Record<UserProfile, string>>;
  forensicClues?: ForensicClue[];
}

export interface PlayerDecision {
  scenarioId: string;
  scenarioTitle: string;
  category: SkillCategory;
  optionId: string;
  chosenText: string;
  safety: DecisionSafety;
  scoreAwarded: number;
  skillImpact: {
    skill: SkillCategory;
    points: number;
  };
  timestamp: number;
  timeSpentSeconds: number;
  consequence: string;
  securityPrinciple: string;
}

export interface GameSession {
  sessionId: string;
  mode: GameMode;
  profile: UserProfile;
  displayName: string;
  startTime: number;
  endTime?: number;
  decisions: PlayerDecision[];
  totalScore: number;
  normalizedScore: number; // 0-100
  completed: boolean;
  scenarioQueue: string[]; // sequence of scenarios to play
  currentScenarioIndex: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'milestone' | 'mastery' | 'skill' | 'recovery';
  unlockedAt?: number;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalDecisionsMade: number;
  saferDecisionsCount: number;
  riskyDecisionsCount: number;
  bestScore: number;
  averageScore: number;
  skillRatings: Record<SkillCategory, { points: number; maxPoints: number; level: number }>;
  completedScenarios: string[];
  dailyStreak: number;
  lastActiveDate?: string;
}

export interface StoredUserData {
  profile: UserProfile;
  displayName: string;
  history: GameSession[];
  activeSession: GameSession | null;
  achievements: Achievement[];
  stats: UserStats;
  preferences: {
    soundEffects: boolean;
    highContrast: boolean;
    showTimer: boolean;
  };
}
