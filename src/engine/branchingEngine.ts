import { DecisionOption, Scenario } from '../types/game';
import { SCENARIO_MAP } from '../data/scenarios';

export interface NextStepResolution {
  nextScenarioId: string | null;
  isBranchingJump: boolean;
  branchReason?: string;
  isChallengeComplete: boolean;
  updatedQueue: string[];
  newIndex: number;
}

export function resolveNextStep(
  currentScenario: Scenario,
  chosenOption: DecisionOption,
  currentQueue: string[],
  currentIndex: number
): NextStepResolution {
  const branchTargetId = chosenOption.nextScenarioId;

  // Case 1: Option explicitly triggers a narrative branch or recovery scenario
  if (branchTargetId && SCENARIO_MAP.has(branchTargetId)) {
    // Insert branch scenario immediately after current scenario in queue
    const updatedQueue = [...currentQueue];
    // Check if the branch is already the immediate next item to avoid duplicates
    if (updatedQueue[currentIndex + 1] !== branchTargetId) {
      updatedQueue.splice(currentIndex + 1, 0, branchTargetId);
    }

    return {
      nextScenarioId: branchTargetId,
      isBranchingJump: true,
      branchReason: `Branching Storyline: Your choice triggered "${SCENARIO_MAP.get(branchTargetId)?.title}"`,
      isChallengeComplete: false,
      updatedQueue,
      newIndex: currentIndex + 1
    };
  }

  // Case 2: Standard progression to next item in queue
  const nextIndex = currentIndex + 1;
  if (nextIndex < currentQueue.length) {
    const nextId = currentQueue[nextIndex];
    if (SCENARIO_MAP.has(nextId)) {
      return {
        nextScenarioId: nextId,
        isBranchingJump: false,
        isChallengeComplete: false,
        updatedQueue: currentQueue,
        newIndex: nextIndex
      };
    }
  }

  // Case 3: Reached end of queue -> Challenge complete
  return {
    nextScenarioId: null,
    isBranchingJump: false,
    isChallengeComplete: true,
    updatedQueue: currentQueue,
    newIndex: currentQueue.length
  };
}
