import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameMode, 
  GameSession, 
  PlayerDecision, 
  Scenario, 
  StoredUserData, 
  UserProfile, 
  DecisionOption,
  SkillCategory
} from './types/game';
import { SCENARIO_MAP, SCENARIOS } from './data/scenarios';
import { buildInitialScenarioQueue, getAdaptiveNextScenario } from './engine/adaptiveEngine';
import { resolveNextStep } from './engine/branchingEngine';
import { calculateSessionScore } from './engine/scoringEngine';
import { evaluateAchievements } from './engine/achievementEngine';
import { 
  loadUserData, 
  saveUserData, 
  updateStatsWithSession, 
  resetAllData, 
  exportDataAsJson 
} from './engine/storageEngine';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameDashboard } from './components/GameDashboard';
import { PlayerSetupModal } from './components/PlayerSetupModal';
import { InteractiveScenarioScreen } from './components/InteractiveScenarioScreen';
import { ResultsReport } from './components/ResultsReport';
import { PracticeModePicker } from './components/PracticeModePicker';
import { HowItWorksModal } from './components/HowItWorksModal';
import { soundManager } from './utils/audio';

type ActiveView = 'welcome' | 'dashboard' | 'game' | 'results' | 'practice';

export const App: React.FC = () => {
  const [userData, setUserData] = useState<StoredUserData>(() => loadUserData());
  const [currentView, setCurrentView] = useState<ActiveView>('welcome');
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [targetPracticeSkill, setTargetPracticeSkill] = useState<SkillCategory | null>(null);

  // Active game session state
  const [currentSession, setCurrentSession] = useState<GameSession | null>(() => userData.activeSession);
  const [isBranchingNext, setIsBranchingNext] = useState<boolean>(false);
  const [branchTitle, setBranchTitle] = useState<string | undefined>(undefined);
  const [adaptiveNote, setAdaptiveNote] = useState<string | undefined>(undefined);

  // Derive active scenario directly from currentSession state
  const activeScenario: Scenario | null = (currentSession && !currentSession.completed)
    ? SCENARIO_MAP.get(currentSession.scenarioQueue[currentSession.currentScenarioIndex]) || SCENARIOS[0]
    : null;

  // Synchronize audio preference
  useEffect(() => {
    soundManager.setEnabled(userData.preferences.soundEffects);
  }, [userData.preferences.soundEffects]);

  // Save changes to localStorage
  const updateUserDataAndSave = useCallback((updater: (prev: StoredUserData) => StoredUserData) => {
    setUserData(prev => {
      const next = updater(prev);
      saveUserData(next);
      return next;
    });
  }, []);

  // Launch a new session
  const startNewGameSession = useCallback((
    profile: UserProfile, 
    displayName: string, 
    mode: GameMode, 
    explicitQueue?: string[]
  ) => {
    const queue = explicitQueue || buildInitialScenarioQueue(mode);
    const newSession: GameSession = {
      sessionId: `HF-${Date.now().toString(36).toUpperCase()}`,
      mode,
      profile,
      displayName: displayName || userData.displayName,
      startTime: Date.now(),
      decisions: [],
      totalScore: 0,
      normalizedScore: 0,
      completed: false,
      scenarioQueue: queue,
      currentScenarioIndex: 0
    };

    setCurrentSession(newSession);
    setIsBranchingNext(false);
    setBranchTitle(undefined);
    setAdaptiveNote(undefined);
    setCurrentView('game');

    updateUserDataAndSave(prev => ({
      ...prev,
      profile,
      displayName: displayName || prev.displayName,
      activeSession: newSession
    }));
  }, [userData.displayName, updateUserDataAndSave]);

  // Quick Demo Scenario trigger (judge mode: 1-click launch of MFA challenge)
  const handleLaunchDemo = useCallback(() => {
    soundManager.playClick();
    startNewGameSession(userData.profile, userData.displayName, 'demo', ['sc-mfa-1']);
  }, [userData.profile, userData.displayName, startNewGameSession]);

  // Handle player making a decision on the interactive scenario screen
  const handleDecisionMade = useCallback((option: DecisionOption, timeSpentSeconds: number) => {
    if (!currentSession || !activeScenario) return;

    // Build decision record
    const decision: PlayerDecision = {
      scenarioId: activeScenario.id,
      scenarioTitle: activeScenario.title,
      category: activeScenario.category,
      optionId: option.id,
      chosenText: option.text,
      safety: option.safety,
      scoreAwarded: option.score,
      skillImpact: option.skillImpact,
      timestamp: Date.now(),
      timeSpentSeconds,
      consequence: option.consequence,
      securityPrinciple: option.securityPrinciple
    };

    // Calculate next step resolution
    const nextStep = resolveNextStep(
      activeScenario,
      option,
      currentSession.scenarioQueue,
      currentSession.currentScenarioIndex
    );

    setIsBranchingNext(nextStep.isBranchingJump);
    if (nextStep.isBranchingJump && nextStep.nextScenarioId) {
      setBranchTitle(SCENARIO_MAP.get(nextStep.nextScenarioId)?.title);
    } else {
      setBranchTitle(undefined);
    }

    // Update active session with new decision and potentially updated queue
    const updatedDecisions = [...currentSession.decisions, decision];
    const scoreData = calculateSessionScore(updatedDecisions);

    const updatedSession: GameSession = {
      ...currentSession,
      decisions: updatedDecisions,
      totalScore: scoreData.rawScore,
      normalizedScore: scoreData.normalizedScore,
      scenarioQueue: nextStep.updatedQueue
    };

    setCurrentSession(updatedSession);
    updateUserDataAndSave(prev => ({
      ...prev,
      activeSession: updatedSession
    }));
  }, [currentSession, activeScenario, updateUserDataAndSave]);

  // Handle continuing to the next scenario or finalizing session
  const handleContinueNextScenario = useCallback(() => {
    if (!currentSession || !activeScenario) return;

    const nextIndex = currentSession.currentScenarioIndex + 1;

    // Check if challenge is complete
    if (nextIndex >= currentSession.scenarioQueue.length) {
      // Challenge Complete!
      const finalScore = calculateSessionScore(currentSession.decisions);
      const completedSession: GameSession = {
        ...currentSession,
        completed: true,
        endTime: Date.now(),
        normalizedScore: finalScore.normalizedScore,
        totalScore: finalScore.rawScore
      };

      // Evaluate achievements
      const { updatedAchievements } = evaluateAchievements(
        completedSession,
        userData.history,
        userData.achievements
      );

      // Update statistics
      const updatedStats = updateStatsWithSession(userData.stats, completedSession);

      updateUserDataAndSave(prev => ({
        ...prev,
        history: [...prev.history, completedSession],
        activeSession: null,
        stats: updatedStats,
        achievements: updatedAchievements
      }));

      setCurrentSession(completedSession);
      setCurrentView('results');
      return;
    }

    // Check for adaptive adjustments for full challenge mode
    if (currentSession.mode === 'full') {
      const alreadyPlayed = new Set(currentSession.decisions.map(d => d.scenarioId));
      alreadyPlayed.add(currentSession.scenarioQueue[nextIndex]);
      const adaptive = getAdaptiveNextScenario(
        currentSession.decisions,
        alreadyPlayed,
        currentSession.profile
      );
      if (adaptive && adaptive.nextScenarioId && SCENARIO_MAP.has(adaptive.nextScenarioId)) {
        setAdaptiveNote(adaptive.reason);
      } else {
        setAdaptiveNote(undefined);
      }
    } else {
      setAdaptiveNote(undefined);
    }

    // Advance session index
    const nextSession: GameSession = {
      ...currentSession,
      currentScenarioIndex: nextIndex
    };

    setCurrentSession(nextSession);
    setIsBranchingNext(false);
    setBranchTitle(undefined);
    updateUserDataAndSave(prev => ({
      ...prev,
      activeSession: nextSession
    }));
  }, [currentSession, activeScenario, userData.history, userData.achievements, userData.stats, updateUserDataAndSave]);

  // Exit from in-progress game
  const handleExitGame = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    updateUserDataAndSave(prev => {
      const nextSound = !prev.preferences.soundEffects;
      soundManager.setEnabled(nextSound);
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          soundEffects: nextSound
        }
      };
    });
  }, [updateUserDataAndSave]);

  // Reset all progress
  const handleResetData = useCallback(() => {
    const fresh = resetAllData();
    setUserData(fresh);
    setCurrentSession(null);
    setCurrentView('welcome');
  }, []);

  // Export JSON
  const handleExportData = useCallback(() => {
    exportDataAsJson(userData);
  }, [userData]);

  // Replay
  const handleReplayChallenge = useCallback(() => {
    if (!currentSession) {
      setIsSetupOpen(true);
      return;
    }
    startNewGameSession(currentSession.profile, currentSession.displayName, currentSession.mode);
  }, [currentSession, startNewGameSession]);

  // Practice weak skill
  const handlePracticeWeakSkill = useCallback((skill: SkillCategory) => {
    setTargetPracticeSkill(skill);
    setCurrentView('practice');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          soundManager.playClick();
          setCurrentView(view);
        }}
        onLaunchDemo={handleLaunchDemo}
        onOpenHowItWorks={() => {
          soundManager.playClick();
          setIsHowItWorksOpen(true);
        }}
        soundEnabled={userData.preferences.soundEffects}
        onToggleSound={handleToggleSound}
        userProfile={userData.profile}
        displayName={userData.displayName}
      />

      {/* Main Content Areas */}
      <main className="flex-1 flex flex-col">
        {currentView === 'welcome' && (
          <WelcomeScreen
            onStartPlaying={() => {
              if (userData.history.length > 0) {
                setCurrentView('dashboard');
              } else {
                setIsSetupOpen(true);
              }
            }}
            onLaunchDemo={handleLaunchDemo}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onPracticeMode={() => {
              setTargetPracticeSkill(null);
              setCurrentView('practice');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <GameDashboard
            userData={userData}
            onStartNewGame={(mode) => startNewGameSession(userData.profile, userData.displayName, mode)}
            onResumeGame={() => {
              if (userData.activeSession) {
                setCurrentSession(userData.activeSession);
                setCurrentView('game');
              }
            }}
            onOpenPractice={() => {
              setTargetPracticeSkill(null);
              setCurrentView('practice');
            }}
            onLaunchDemo={handleLaunchDemo}
            onViewSessionReport={(session) => {
              setCurrentSession(session);
              setCurrentView('results');
            }}
            onExportJson={handleExportData}
            onResetProgress={handleResetData}
            onOpenSetup={() => setIsSetupOpen(true)}
          />
        )}

        {currentView === 'game' && activeScenario && currentSession && (
          <InteractiveScenarioScreen
            scenario={activeScenario}
            currentRound={currentSession.currentScenarioIndex + 1}
            totalRounds={currentSession.scenarioQueue.length}
            userProfile={currentSession.profile}
            onDecisionMade={handleDecisionMade}
            onContinue={handleContinueNextScenario}
            onExit={handleExitGame}
            isBranchingNext={isBranchingNext}
            branchTitle={branchTitle}
            adaptiveNote={adaptiveNote}
          />
        )}

        {currentView === 'results' && currentSession && (
          <ResultsReport
            session={currentSession}
            history={userData.history}
            onReplay={handleReplayChallenge}
            onPracticeWeakSkill={handlePracticeWeakSkill}
            onExportJson={handleExportData}
            onReturnDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'practice' && (
          <PracticeModePicker
            targetSkill={targetPracticeSkill}
            onSelectScenario={(scenarioId) => {
              startNewGameSession(userData.profile, userData.displayName, 'practice', [scenarioId]);
            }}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onResetData={handleResetData}
        onExportData={handleExportData}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Setup Modal */}
      <PlayerSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        initialProfile={userData.profile}
        initialDisplayName={userData.displayName}
        onStartGame={(profile, displayName, mode) => {
          setIsSetupOpen(false);
          startNewGameSession(profile, displayName, mode);
        }}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
};

export default App;
